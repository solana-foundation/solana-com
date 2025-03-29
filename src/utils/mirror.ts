"use server";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function getMirrorInstance(): Promise<{
  mirrorUrl: string;
  wsMirrorUrl: string;
}> {
  let c = await cookies();
  let userId = c.get("user_id")?.value;
  if (!userId) {
    userId = uuidv4();
    c.set("user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  if (!userId) {
    return {
      mirrorUrl: "http://localhost:8899",
      wsMirrorUrl: "ws://localhost:8900",
    };
  }

  const mirrorApiKey = process.env.MIRROR_API_KEY;
  if (!mirrorApiKey) {
    return {
      mirrorUrl: "http://localhost:8899",
      wsMirrorUrl: "ws://localhost:8900",
    };
  }
  // get the user_id from the users cookies

  const response = await fetch("https://api.mirror.ad/blockchains/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_key: mirrorApiKey,
      user_id: userId,
    },
  });

  if (!response.ok) {
    console.log(
      `Error fetching mirror instance: ${response.status} ${response.statusText}`,
    );
    return {
      mirrorUrl: "http://localhost:8899",
      wsMirrorUrl: "ws://localhost:8900",
    };
  }
  const session = await response.json();
  if (!session.url || !session.wsUrl) {
    return {
      mirrorUrl: "http://localhost:8899",
      wsMirrorUrl: "ws://localhost:8900",
    };
  }

  return {
    mirrorUrl: session.url,
    wsMirrorUrl: session.wsUrl,
  };
}

export type CodeRun = {
  output: string;
  logs: {
    id: string;
    created_at: string;
    url: string;
    transaction_signature: string;
    log: string;
    index: number;
    transaction: {
      id: string;
      created_at: string;
      version: string;
      recent_blockhash: string;
      slot: number;
      blockchain_id: string;
      signature: string;
    };
  }[];
};
