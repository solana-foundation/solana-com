import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const databricks = vi.hoisted(() => ({
  clientClose: vi.fn(),
  connect: vi.fn(),
  executeStatement: vi.fn(),
  fetchAll: vi.fn(),
  openSession: vi.fn(),
  operationClose: vi.fn(),
  sessionClose: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@databricks/sql", () => ({
  DBSQLClient: class MockDBSQLClient {
    connect = databricks.connect;
    close = databricks.clientClose;
  },
}));

import {
  getDatabricksConfig,
  getDatabricksSqlMetricRows,
} from "@/lib/databricks/server";

describe("Databricks server integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    databricks.fetchAll.mockResolvedValue([]);
    databricks.executeStatement.mockResolvedValue({
      close: databricks.operationClose,
      fetchAll: databricks.fetchAll,
      id: "statement-123",
    });
    databricks.openSession.mockResolvedValue({
      close: databricks.sessionClose,
      executeStatement: databricks.executeStatement,
    });
    databricks.connect.mockResolvedValue({
      openSession: databricks.openSession,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes valid environment configuration", () => {
    vi.stubEnv(
      "DATABRICKS_SERVER_HOSTNAME",
      "https://workspace.cloud.databricks.com/ignored-path",
    );
    vi.stubEnv(
      "DATABRICKS_HTTP_PATH",
      "jdbc:spark://workspace.cloud.databricks.com:443/default;httpPath=%2Fsql%2F1.0%2Fwarehouses%2Fwarehouse-123;AuthMech=3",
    );
    vi.stubEnv("DATABRICKS_TOKEN", "test-token");

    expect(getDatabricksConfig()).toEqual({
      ok: true,
      config: {
        httpPath: "/sql/1.0/warehouses/warehouse-123",
        serverHostname: "workspace.cloud.databricks.com",
        token: "test-token",
        warehouseId: "warehouse-123",
      },
    });
  });

  it("reports missing and invalid environment configuration", () => {
    vi.stubEnv("DATABRICKS_SERVER_HOSTNAME", "not a valid hostname");
    vi.stubEnv("DATABRICKS_HTTP_PATH", "/invalid/path");
    vi.stubEnv("DATABRICKS_TOKEN", "");

    expect(getDatabricksConfig()).toEqual({
      ok: false,
      invalidEnv: ["DATABRICKS_SERVER_HOSTNAME", "DATABRICKS_HTTP_PATH"],
      missingEnv: ["DATABRICKS_TOKEN"],
    });
  });

  it("executes a statement through the Databricks 2 client contract", async () => {
    databricks.fetchAll.mockResolvedValue([
      {
        date: new Date("2026-07-20T00:00:00.000Z"),
        metric_name: "TPS",
        provider_name: "Dune",
        unit: "transactions/second",
        value: "123.5",
      },
      {
        date: "2026-07-20",
        metric_name: null,
        provider_name: "Dune",
        unit: "transactions/second",
        value: 456,
      },
    ]);

    const result = await getDatabricksSqlMetricRows(
      {
        httpPath: "/sql/1.0/warehouses/warehouse-123",
        serverHostname: "workspace.cloud.databricks.com",
        token: "test-token",
        warehouseId: "warehouse-123",
      },
      {
        lookbackDays: 7.9,
        metricNames: ["TPS", "fees' paid", "TPS"],
      },
    );

    expect(databricks.connect).toHaveBeenCalledWith({
      host: "workspace.cloud.databricks.com",
      path: "/sql/1.0/warehouses/warehouse-123",
      token: "test-token",
    });
    expect(databricks.openSession).toHaveBeenCalledOnce();
    expect(databricks.executeStatement).toHaveBeenCalledOnce();

    const [statement, executeOptions] = databricks.executeStatement.mock
      .calls[0] as [string, { runAsync: boolean }];

    expect(statement).toContain("m.name IN ('TPS', 'fees'' paid')");
    expect(statement).toContain("mv.date >= date_sub(current_date(), 7)");
    expect(executeOptions).toEqual({ runAsync: true });
    expect(result).toEqual({
      rows: [
        {
          date: "2026-07-20",
          metricName: "TPS",
          providerName: "Dune",
          unit: "transactions/second",
          value: 123.5,
        },
      ],
      statementId: "statement-123",
      truncated: false,
    });

    expect(databricks.operationClose).toHaveBeenCalledOnce();
    expect(databricks.sessionClose).toHaveBeenCalledOnce();
    expect(databricks.clientClose).toHaveBeenCalledOnce();
    expect(databricks.operationClose.mock.invocationCallOrder[0]).toBeLessThan(
      databricks.sessionClose.mock.invocationCallOrder[0],
    );
    expect(databricks.sessionClose.mock.invocationCallOrder[0]).toBeLessThan(
      databricks.clientClose.mock.invocationCallOrder[0],
    );
  });

  it("closes Databricks resources when fetching results fails", async () => {
    databricks.fetchAll.mockRejectedValueOnce(new Error("query failed"));

    await expect(
      getDatabricksSqlMetricRows(
        {
          httpPath: "/sql/1.0/warehouses/warehouse-123",
          serverHostname: "workspace.cloud.databricks.com",
          token: "test-token",
          warehouseId: "warehouse-123",
        },
        { lookbackDays: 30, metricNames: ["TPS"] },
      ),
    ).rejects.toThrow("query failed");

    expect(databricks.operationClose).toHaveBeenCalledOnce();
    expect(databricks.sessionClose).toHaveBeenCalledOnce();
    expect(databricks.clientClose).toHaveBeenCalledOnce();
  });
});
