import Header from "../../components/header";
import SearchHeader from "./components/search-header";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SearchHeader />
      <div className="relative z-10">{children}</div>
    </>
  );
}
