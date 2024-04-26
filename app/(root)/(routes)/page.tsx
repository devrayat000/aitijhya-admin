import Image from "next/image";
import logoSingle from "@/assets/logo_single.png";
import { Camera, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="h-full grid place-items-center">
      <div className="w-full max-w-[52rem] mx-auto">
        <div className="flex justify-center">
          <Image src={logoSingle} alt="logo" width={200} />
        </div>
        <form role="search" className="mt-10" method="get" action="/search">
          <div className="flex items-center gap-2 max-w-[52rem] mx-auto">
            <div className="px-4 flex flex-1 h-12 w-full rounded-full border border-input bg-input py-2 text-sm items-center justify-between gap-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Questions or keywords..."
                className="flex-1 bg-transparent text-sm p-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                type="search"
                name="query"
              />
              <Separator
                orientation="vertical"
                className="bg-slate-400 w-0.5"
              />
              <Button
                size="icon"
                variant="ghost"
                className="w-9 h-9 rounded-full"
                type="button"
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
                {/* <input {...getInputProps()} /> */}
              </Button>
            </div>

            <Button
              type="submit"
              size="icon"
              className="w-12 h-12 rounded-full bg-card-result hover:bg-card-result/90"
              variant="default"
            >
              <Search className="h-8 w-8 text-white" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
