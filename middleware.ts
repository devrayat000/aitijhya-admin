import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// export default withAuth({
//   pages: {
//     signIn: "/signin",
//     error: "/signin",
//     newUser: "/init",
//   },
//   callbacks: {
//     authorized({ token, req }) {
//       const url = new URL(req.url);

//       if (token?.type === "admin" && url.pathname.includes("admin")) {
//         return true;
//       }

//       if (token?.type === "user" && !url.pathname.includes("admin")) {
//         return true;
//       }

//       return false;
//     },
//   },
// });

export default withAuth(
  (req, ev) => {
    const url = new URL(req.url);
    const token = req.nextauth?.token;

    if (url.pathname.includes("admin")) {
      if (url.pathname.includes("signin")) {
        return NextResponse.next();
      }
      if (token?.type === "admin") {
        return NextResponse.next();
      }
      return NextResponse.redirect(`${req.nextUrl.origin}/admin/signin`);
    } else {
      if (token?.type === "user") {
        return NextResponse.next();
      }
      return NextResponse.redirect(`${req.nextUrl.origin}/signin`);
    }
  },
  {
    pages: {
      signIn: "/signin",
      error: "/signin",
      newUser: "/init",
    },
  }
);

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
    "/admin/:path*",
    "/search",
    "/bookmarks",
  ],
};
