import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRef } from "react";
import { useSearchBox } from "react-instantsearch";

export function SearchBox() {
  const { clear, query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.focus();
        }}
        onReset={(e) => {
          e.preventDefault();
          e.stopPropagation();
          clear();
          inputRef.current?.focus();
        }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Questions of keywords..."
            className="px-10 flex h-12 w-full rounded-full border border-input bg-input py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={query}
            onChange={(e) => refine(e.target.value)}
            ref={inputRef}
            type="search"
          />
          {!!query && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full"
              type="reset"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
