import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Memo } from "@/types/memo";

interface MemoStore {
  memos: Memo[];
  addMemo: (memo: Memo) => void;
  deleteMemo: (id: string) => void;
  updateMemo: (id: string, content: string) => void;
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set) => ({
      memos: [],
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
    }),
    {
      name: "memo-storage",
    }
  )
);
