"use client";

import { motion } from "framer-motion";
import { Camera, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchStore, useStore } from "@/hooks/use-search-history";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams?.get("query") ?? ""
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const history = useStore(useSearchStore, (store) => store.history);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const popupRef = useClickAway<HTMLUListElement>(() => {
    document.activeElement !== inputRef.current && setShowSuggestions(false);
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log("clicked suggestion", suggestion);
    setInputValue(suggestion);
    router.push(`/search?query=${suggestion}`);
  };

  const filteredHistory = useMemo(
    () =>
      history?.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [inputValue, history]
  );

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { action } = event.currentTarget;
      useSearchStore.getState().saveHistory(inputValue);
      router.push(`${action}?query=${inputValue}`);
    },
    [inputValue, router]
  );

  return (
    <form role="search" method="get" action="/search" onSubmit={onSubmit}>
      <div className="flex items-center gap-2">
        <div className="relative isolate z-10 px-4 flex flex-1 h-12 w-full rounded-full border border-input bg-input py-2 text-sm items-center justify-between gap-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Questions or keywords..."
            className="flex-1 bg-transparent text-sm p-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            type="search"
            name="query"
            value={inputValue}
            onChange={handleChange}
            ref={inputRef}
            onFocus={() => setShowSuggestions(true)}
          />
          <Separator orientation="vertical" className="bg-slate-400 w-0.5" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-9 h-9 rounded-full"
                  type="button"
                >
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  {/* <input {...getInputProps()} /> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This feature is still under development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showSuggestions && filteredHistory && filteredHistory.length > 0 && (
            <motion.ul
              ref={popupRef}
              className="absolute top-full left-0 mt-2 w-full shadow z-50 rounded-lg bg-background"
            >
              {filteredHistory.map((suggestion, index) => (
                <motion.li
                  key={index}
                  className={buttonVariants({
                    size: "lg",
                    variant: "ghost",
                    className:
                      "w-full cursor-pointer text-left justify-stretch",
                  })}
                  role="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </motion.li>
              ))}
            </motion.ul>
          )}
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
  );
}
