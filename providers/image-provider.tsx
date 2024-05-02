"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostHit } from "@/server/post/service";

import { useEbook } from "@/hooks/use-ebook";
import Image from "next/image";

const ImageProvider = () => {
  const popupStore = useEbook();
  const post = popupStore.popupData;

  return (
    // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.js">
    <Dialog
      open={popupStore.isOpen}
      onOpenChange={(open) => !open && popupStore.close()}
      modal
    >
      {popupStore.isOpen && !!post && !!post.imageUrl && (
        <DialogContent className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 p-0 pt-12">
          <div className="w-full aspect-[3/4]">
            <Image src={post.imageUrl} fill alt="Search Result" quality={1} />
          </div>
        </DialogContent>
      )}
    </Dialog>
    // </Worker>
  );
};

export default ImageProvider;
