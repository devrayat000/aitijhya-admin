import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
    newUser: "/init",
  },
  // callbacks: {
  //   authorized({ token, req }) {
  //     const url = new URL(req.url);

  //     if (token?.type === "admin" && url.pathname.includes("admin")) {
  //       return true;
  //     }

  //     if (token?.type === "user" && !url.pathname.includes("admin")) {
  //       return true;
  //     }

  //     return false;
  //   },
  // },
});

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
    // "/admin/:path*",
    "/search",
    "/bookmarks",
  ],
};
