import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Memo } from "@/types/memo";

interface MemoStore {
  memos: Memo[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  addMemo: (memo: Memo) => void;
  deleteMemo: (id: string) => void;
  updateMemo: (id: string, content: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  getAllCategories: () => string[];
  getAllTags: () => string[];
  getFilteredMemos: () => Memo[];
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set, get) => ({
      memos: [],
      searchQuery: "",
      selectedCategory: null,
      selectedTags: [],
      addMemo: (memo) =>
        set((state) => ({
          memos: [memo, ...state.memos],
        })),
      deleteMemo: (id) =>
        set((state) => ({
          memos: state.memos.filter((memo) => memo.id !== id),
        })),
      updateMemo: (id, content) =>
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === id ? { ...memo, content, updatedAt: new Date() } : memo
          ),
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      getAllCategories: () => {
        const categories = new Set(
          get()
            .memos.map((memo) => memo.category)
            .filter((category): category is string => !!category)
        );
        return Array.from(categories);
      },
      getAllTags: () => {
        const tags = new Set(get().memos.flatMap((memo) => memo.tags || []));
        return Array.from(tags);
      },
      getFilteredMemos: () => {
        const { memos, searchQuery, selectedCategory, selectedTags } = get();

        return memos.filter((memo) => {
          // 검색어가 있는 경우 부분 일치도 검색
          const matchesSearch =
            !searchQuery ||
            memo.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memo.tags?.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            memo.category?.toLowerCase().includes(searchQuery.toLowerCase());

          // 카테고리 필터링
          const matchesCategory =
            !selectedCategory || memo.category === selectedCategory;

          // 태그 필터링
          const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => memo.tags?.includes(tag));

          return matchesSearch && matchesCategory && matchesTags;
        });
      },
    }),
    {
      name: "memo-storage",
    }
  )
);
