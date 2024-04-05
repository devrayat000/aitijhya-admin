"use client";

import "regenerator-runtime/runtime";

import { motion } from "framer-motion";
import { useFormState } from "react-dom";
import { Search, Camera, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch";
import { useDropzone } from "react-dropzone";

import logoMulti from "@/assets/logo_multi.png";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getTextFromImage } from "@/actions/ocr";
import { useRouter, useSearchParams } from "next/navigation";

function queryHook(query: string, hook: (value: string) => void) {
  if (!!query) {
    return hook(query);
  }
}

const MotionButton = motion(Button);

export function SearchBox() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("q") || "";

  const { clear, refine: executeSearch } = useSearchBox({ queryHook });
  const [q, setQ] = useState(searchQuery);

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    listening,
    isMicrophoneAvailable,
    resetTranscript,
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { toast } = useToast();

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
      router.push(`.?q=${q}`);
      inputRef.current?.focus();
    },
    [q]
  );

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setQ("");
      clear();
      inputRef.current?.focus();
    },
    [clear]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
    []
  );

  useEffect(() => {
    executeSearch(searchQuery);
  }, [searchQuery]);

  console.log({ q });

  useEffect(() => {
    if (!!ocrText) {
      setQ(ocrText);
    }
  }, [ocrText]);

  useEffect(() => {
    if (!!transcript) {
      setQ(transcript);
    }
  }, [transcript]);

  const startSpeechRecognition = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Speech recognition is not supported by your browser",
        description: "Please use a modern browser",
      });
    }
    if (isMicrophoneAvailable) {
      SpeechRecognition.startListening();
    }
  }, [isMicrophoneAvailable, browserSupportsSpeechRecognition, toast]);

  const disabled = isLoadingOCR || listening;
  console.log("q=", q);

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center">
        <Image src={logoMulti} alt="logo" width={120} />
      </div>
      <form role="search" onSubmit={onSearch} onReset={onReset}>
        <motion.div
          layoutId="search-input"
          className="px-4 flex h-12 w-full rounded-full border border-input bg-input py-2 text-sm items-center justify-between gap-x-2"
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
          {/* {!listening ? (
            <MotionButton
              layoutId="mic"
              key="mic"
              size="icon"
              variant="ghost"
              className="w-9 h-9 rounded-full -mr-2"
              type="button"
              onClick={startSpeechRecognition}
              disabled={disabled}
            >
              <Mic className="h-5 w-5 text-muted-foreground" />
            </MotionButton>
          ) : (
            <MotionButton
              layoutId="mic"
              key="mic-off"
              size="icon"
              variant="ghost"
              className="w-9 h-9 rounded-full -mr-2"
              type="button"
              onClick={() => SpeechRecognition.stopListening()}
              disabled={disabled}
            >
              <MicOff className="h-5 w-5 text-muted-foreground" />
            </MotionButton>
          )} */}
        </motion.div>
      </form>
    </div>
  );
}
