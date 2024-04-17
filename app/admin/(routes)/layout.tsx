import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/providers/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
}
