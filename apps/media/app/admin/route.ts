import { permanentRedirect } from "next/navigation";

export async function GET() {
  permanentRedirect("/admin/index.html");
}
