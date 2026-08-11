const REPOSITORY = "solana-foundation/solana-com";

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((item) => item.trim().split("="))
    .find(([key]) => key === name)?.[1];

  return value ? decodeURIComponent(value) : null;
}

export async function canManageReportBlobs(request: Request) {
  if (process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL === "true") {
    return process.env.NODE_ENV !== "production";
  }

  const accessToken = getCookie(request, "keystatic-gh-access-token");
  if (!accessToken) return false;

  const viewerResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!viewerResponse.ok) return false;

  const viewer = (await viewerResponse.json()) as { login?: string };
  if (!viewer.login) return false;

  const permissionResponse = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/collaborators/${viewer.login}/permission`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!permissionResponse.ok) return false;

  const permission = (await permissionResponse.json()) as {
    permission?: string;
  };
  return ["admin", "maintain", "write"].includes(permission.permission ?? "");
}
