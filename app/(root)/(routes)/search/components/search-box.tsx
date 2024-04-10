"use client";

import { motion } from "framer-motion";
import { useFormState } from "react-dom";
import { Search, Camera } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchBox, AdditionalWidgetProperties } from "react-instantsearch";
import { useDropzone } from "react-dropzone";

import logoSingle from "@/assets/logo_single.png";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTextFromImage } from "@/actions/ocr";
import { addToHistory } from "@/actions/history";
import { useServerStore } from "@/hooks/use-server-data";
import Link from "next/link";

function queryHook(query: string, hook: (value: string) => void) {
  if (!!query) {
    return hook(query);
  }
}

type GetWidgetSearchParameters = Exclude<
  AdditionalWidgetProperties["getWidgetSearchParameters"],
  undefined
>;

export function SearchBox() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("q") || "";
  const addToStoreSearchHistory = useServerStore(
    (store) => store.addSearchHistory
  );

  const [q, setQ] = useState(searchQuery);
  const { clear, refine: executeSearch } = useSearchBox(
    { queryHook },
    {
      getWidgetSearchParameters: useCallback<GetWidgetSearchParameters>(
        (state) => {
          console.log({ ...state });
          return Object.assign(state, { optionalWords: [q] });
        },
        [q]
      ),
    }
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const [ocrText, ocrExecute, isLoadingOCR] = useFormState(getTextFromImage, q);
  const { open, getInputProps } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    multiple: false,
    onDrop(acceptedFiles) {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      ocrExecute(formData);
    },
  });

  const onSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`./search/?q=${q}`);
      inputRef.current?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q]
  );

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setQ("");
      router.push(`.`);
      clear();
      inputRef.current?.focus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clear]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
    []
  );

  useEffect(() => {
    if (!!searchQuery) {
      executeSearch(searchQuery);
      addToHistory(searchQuery, searchQuery);
      addToStoreSearchHistory(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (!!ocrText) {
      setQ(ocrText);
    }
  }, [ocrText]);

  const disabled = isLoadingOCR;

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/">
        <motion.div layoutId="search-icon" className="flex justify-center mb-2">
          <Image src={logoSingle} alt="logo" width={120} />
        </motion.div>
      </Link>
      <form role="search" onSubmit={onSearch} onReset={onReset}>
        <div className="flex items-center gap-2">
          <motion.div
            layoutId="search-input"
            className="px-4 flex flex-1 h-12 w-full rounded-full border border-input bg-input py-2 text-sm items-center justify-between gap-x-2"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Questions of keywords..."
              className="flex-1 bg-transparent text-sm p-0 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={q}
              disabled={disabled}
              onChange={onInputChange}
              ref={inputRef}
              type="search"
            />
            <Separator orientation="vertical" className="bg-slate-400 w-0.5" />
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 rounded-full"
              type="button"
              onClick={open}
              disabled={disabled}
            >
              <Camera className="h-5 w-5 text-muted-foreground" />
              <input {...getInputProps()} />
            </Button>
          </motion.div>

          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full bg-card-result hover:bg-card-result/90"
            variant="default"
          >
            <Search className="h-8 w-8 text-muted-foreground" />
          </Button>
        </div>
      </form>
    </div>
  );
}
