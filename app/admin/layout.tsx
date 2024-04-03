import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/providers/theme-provider";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // const store = await prismadb.store.findFirst({
  //   where: {
  //     id: params.storeId,
  //     userId,
  //   }
  //  });

  // if (!store) {
  //   redirect('/');
  // };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
}
