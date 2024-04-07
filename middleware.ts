import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
    newUser: "/init",
  },
  //   callbacks: {
  //     authorized(params) {
  //       console.log(params.token);
  //       return true;
  //     },
  //   },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin).*)"],
};
