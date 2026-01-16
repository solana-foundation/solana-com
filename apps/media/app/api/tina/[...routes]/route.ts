import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import databaseClient from "../../../../tina/__generated__/databaseClient";
import { AuthProvider } from "../../../../lib/auth";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const backend = TinaNodeBackend({
  authProvider: isLocal ? LocalBackendAuthProvider() : AuthProvider,
  databaseClient,
});

export const POST = backend;
export const GET = backend;
