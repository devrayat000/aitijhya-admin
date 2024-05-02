"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostTable } from "@/server/post/service";
import Image from "next/image";
import { create } from "zustand";

type PopupState = {
  isOpen: boolean;
  open: (data: PostTable) => void;
  close: () => void;
  onChange: (open: boolean) => void;
  popupData: PostTable | null;
};

export const usePopup = create<PopupState>((set) => ({
  isOpen: false,
  popupData: null,
  open: (data) => set({ isOpen: true, popupData: data }),
  close: () => set({ isOpen: false, popupData: null }),
  onChange: (open) => set({ isOpen: open, popupData: null }),
}));

export const PopupProvider = () => {
  const popupStore = usePopup();
  const post = popupStore.popupData;

  return (
    <Dialog
      open={popupStore.isOpen}
      onOpenChange={(open) => !open && popupStore.close()}
      modal
    >
      {popupStore.isOpen && !!post && (
        <DialogContent className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div>
            <Image
              src={post.imageUrl!}
              alt={post.book.name}
              className="rounded-inherit object-cover"
              fill
            />
            <div className="flex items-end justify-between mt-px">
              <div>
                <span className="text-xs leading-none">Page {post.page}</span>
                <h6 className="text-sm leading-none mt-px">{post.book.name}</h6>
              </div>
              <p className="text-xs leading-none">{post.chapter.name}</p>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
