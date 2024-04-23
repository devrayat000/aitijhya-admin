import { PostHitResults } from "@/services/post";
import { create } from "zustand";

type EbookPopupState = {
  isOpen: boolean;
  open: (
    data: Pick<PostHitResults[number], "bookUrl" | "page" | "imageUrl">
  ) => void;
  close: () => void;
  onChange: (open: boolean) => void;
  popupData: Pick<
    PostHitResults[number],
    "bookUrl" | "page" | "imageUrl"
  > | null;
};

export const useEbook = create<EbookPopupState>((set) => ({
  isOpen: false,
  popupData: null,
  open: (data) => set({ isOpen: true, popupData: data }),
  close: () => set({ isOpen: false, popupData: null }),
  onChange: (open) => set({ isOpen: open, popupData: null }),
}));
