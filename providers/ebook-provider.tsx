"use client";

import { Suspense, use } from "react";
import { create } from "zustand";

import Loading from "@/app/loading";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import splitPdf from "@/lib/split-pdf";
import { PostHitResults } from "@/services/post";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useMeasure } from "@uidotdev/usehooks";
import { ScrollArea } from "@/components/ui/scroll-area";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type EbookPopupState = {
  isOpen: boolean;
  open: (data: Pick<PostHitResults[number], "bookUrl" | "page">) => void;
  close: () => void;
  onChange: (open: boolean) => void;
  popupData: Pick<PostHitResults[number], "bookUrl" | "page"> | null;
};

export const useEbook = create<EbookPopupState>((set) => ({
  isOpen: false,
  popupData: null,
  open: (data) => set({ isOpen: true, popupData: data }),
  close: () => set({ isOpen: false, popupData: null }),
  onChange: (open) => set({ isOpen: open, popupData: null }),
}));

type EbookViewerProps = {
  page: number;
  bookUrl: string;
};

const options = {
  cMapUrl: "/cmaps/",
};

function EbookViewer({ bookUrl, page }: EbookViewerProps) {
  let effectivePage = page - 1;
  effectivePage = effectivePage < 0 ? 0 : effectivePage;
  const url = use(splitPdf(bookUrl, effectivePage));
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  return (
    <object data={url} className="h-[80vh] w-full">
      <ScrollArea className="h-[80vh] w-full" ref={containerRef}>
        <Document file={url} options={options}>
          <Page pageNumber={1} width={width || undefined} />
        </Document>
      </ScrollArea>
    </object>
  );
}

const EbookProvider = () => {
  const popupStore = useEbook();
  const post = popupStore.popupData;

  return (
    // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.js">
    <Dialog
      open={popupStore.isOpen}
      onOpenChange={(open) => !open && popupStore.close()}
      modal
    >
      {popupStore.isOpen && !!post && (
        <DialogContent className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 p-0 pt-12">
          <Suspense fallback={<Loading />}>
            <EbookViewer bookUrl={post.bookUrl!} page={post.page} />
          </Suspense>
        </DialogContent>
      )}
    </Dialog>
    // </Worker>
  );
};

export default EbookProvider;
