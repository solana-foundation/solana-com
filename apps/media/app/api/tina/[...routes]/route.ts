import { NextRequest, NextResponse } from "next/server";
import { databaseRequest } from "../../../../tina/__generated__/databaseClient";

// App Router handler for TinaCMS GraphQL endpoint
async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    // Only handle POST requests for GraphQL
    if (request.method === "POST") {
      const body = await request.json();
      const { query, variables } = body;

      // Execute the query directly against the database
      const result = await databaseRequest({
        query,
        variables,
        user: undefined, // Add auth user if needed
      });

      return NextResponse.json(result);
    }

    // Handle GET requests (health check or introspection)
    if (request.method === "GET") {
      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("TinaCMS API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: String(error) },
      { status: 500 }
    );
  }
}

export const POST = handler;
export const GET = handler;
