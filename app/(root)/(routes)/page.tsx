import Image from "next/image";
import dynamic from "next/dynamic";
import SearchForm from "./search/components/search-form";

import logoSingle from "@/assets/logo_single.png";

// const SearchForm = dynamic(() => import("./search/components/search-form"), {
//   ssr: false,
// });

export default function LandingPage() {
  console.log("demo");

  return (
    <div className="h-full grid place-items-center">
      <div className="w-full max-w-[52rem] mx-auto">
        <div className="flex justify-center mb-10">
          <Image src={logoSingle} alt="logo" width={200} />
        </div>
        <div className=" max-w-[52rem] mx-auto">
          <SearchForm />
        </div>
      </div>
    </div>
  );
}
