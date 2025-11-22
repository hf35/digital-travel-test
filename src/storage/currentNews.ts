// store/news.ts
import { NewsItem } from "@/services/types/api";
import { create } from "zustand";


interface NewsStoreState {
  selected: NewsItem | null;
  setSelected: (n: NewsItem) => void;
}

export const useNewsStore = create<NewsStoreState>(set => ({
  selected: null,
  setSelected: (n: NewsItem) => set({ selected: n }),
}));
