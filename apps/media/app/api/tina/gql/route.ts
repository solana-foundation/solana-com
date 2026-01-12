import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolve } from "@tinacms/datalayer";
import { getDatabase, isLocalMode } from "@/tina/database";

/**
 * GraphQL API route for TinaCMS
 *
 * Handles GraphQL queries and mutations from the CMS admin UI.
 * Mutations require authentication (checked via NextAuth JWT).
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    // Check if this is a mutation (write operation)
    const isMutation =
      query?.trim().startsWith("mutation") || query?.includes("mutation ");

    // Require authentication for mutations in production
    if (isMutation && !isLocalMode) {
      const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
      });

      if (!token) {
        return NextResponse.json(
          { errors: [{ message: "Authentication required for mutations" }] },
          { status: 401 }
        );
      }
    }

    // Get the database instance
    const database = await getDatabase();

    // Resolve the GraphQL query/mutation
    const result = await resolve({
      database,
      query,
      variables,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GraphQL error:", error);

    return NextResponse.json(
      {
        errors: [
          {
            message:
              error instanceof Error ? error.message : "Internal server error",
          },
        ],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return basic API info for GET requests
  return NextResponse.json({
    name: "Tina CMS GraphQL API",
    version: "1.0.0",
    status: "ok",
    mode: isLocalMode ? "local" : "production",
  });
}
