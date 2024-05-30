import Header from "../../components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="relative z-10">{children}</div>
    </>
  );
}
