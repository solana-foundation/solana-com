import { describe, expect, it } from "vitest";
import { awardsRuntimeDatabaseUrl } from "@/lib/awards-database-url";

describe("awards runtime database URL", () => {
  it("limits each warm runtime to one pooled database connection", () => {
    const value = awardsRuntimeDatabaseUrl(
      "postgresql://user:password@example.com:5432/awards?sslmode=require&connection_limit=8",
    );
    const url = new URL(value!);

    expect(url.searchParams.get("connection_limit")).toBe("1");
    expect(url.searchParams.get("pool_timeout")).toBe("10");
    expect(url.searchParams.get("sslmode")).toBe("require");
  });

  it("allows database-free builds to construct the client", () => {
    expect(awardsRuntimeDatabaseUrl(undefined)).toBeUndefined();
  });
});
