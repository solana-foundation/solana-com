import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/\/rss$/, "/rss.xml");
  return NextResponse.redirect(url, 308);
}
