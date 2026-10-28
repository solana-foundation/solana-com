import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/dvp-demo/fund/route";

const mocks = vi.hoisted(() => ({
  allow: vi.fn(() => true),
  fundRoles: vi.fn(),
}));
vi.mock("@/lib/delivery-vs-payment/server/rateLimit", () => ({
  allow: mocks.allow,
  clientKey: () => "client",
}));
vi.mock("@/lib/delivery-vs-payment/server/solana", () => ({
  fundRoles: mocks.fundRoles,
}));

const validAddress = "So11111111111111111111111111111111111111112";

function request(body: unknown) {
  return new Request("http://localhost/api/dvp-demo/fund", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => vi.clearAllMocks());

describe("DvP funding route", () => {
  it("funds caller-selected valid role addresses", async () => {
    const addresses = {
      maker: validAddress,
      partyA: validAddress,
      partyB: validAddress,
      authority: validAddress,
    };
    mocks.fundRoles.mockResolvedValue({ mints: {}, setupSignatures: [] });
    const response = await POST(request({ addresses }));
    expect(response.status).toBe(200);
    expect(mocks.fundRoles).toHaveBeenCalledWith(addresses);
  });

  it("does not fund missing roles or requests over the limit", async () => {
    expect(
      (await POST(request({ addresses: { partyA: validAddress } }))).status,
    ).toBe(400);
    expect(mocks.fundRoles).not.toHaveBeenCalled();
    mocks.allow.mockReturnValueOnce(false);
    expect((await POST(request({ addresses: {} }))).status).toBe(429);
    expect(mocks.fundRoles).not.toHaveBeenCalled();
  });
});
