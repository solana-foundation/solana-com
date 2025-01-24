import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|opengraph|_next|_vercel|.*\\..*).*)"],
};

// TODO add this back
// export async function middleware(req) {
//   if (req.nextUrl.pathname === req.nextUrl.pathname.toLowerCase()) {
//     return NextResponse.next();
//   }

//   return NextResponse.redirect(
//     `${req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()}`,
//   );
// }
