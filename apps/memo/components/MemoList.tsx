"use client";

import { useMemoStore } from "@/store/memoStore";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { highlightText } from "@/lib/highlight";

export default function MemoList() {
  const getFilteredMemos = useMemoStore((state) => state.getFilteredMemos);
  const searchQuery = useMemoStore((state) => state.searchQuery);
  const deleteMemo = useMemoStore((state) => state.deleteMemo);
  const memos = getFilteredMemos();

  return (
    <div className="space-y-4">
      {memos.length === 0 ? (
        <div className="text-center text-gray-500 py-8">메모가 없습니다</div>
      ) : (
        memos.map((memo) => (
          <div
            key={memo.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(memo.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
                {memo.category && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {memo.category}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMemo(memo.id)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </Button>
            </div>
            <p
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightText(memo.content, searchQuery),
              }}
            />
            <div className="mt-2 space-x-2">
              {memo.isVoiceRecorded && (
                <span className="inline-block text-xs text-blue-500">
                  🎤 음성으로 작성됨
                </span>
              )}
              {memo.tags?.map((tag) => (
                <span key={tag} className="inline-block text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
