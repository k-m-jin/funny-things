"use client";

import { useMemoStore } from "@/store/memoStore";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function MemoList() {
  const memos = useMemoStore((state) => state.memos);
  const deleteMemo = useMemoStore((state) => state.deleteMemo);

  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <div key={memo.id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(memo.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMemo(memo.id)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </Button>
          </div>
          <p className="whitespace-pre-wrap">{memo.content}</p>
          {memo.isVoiceRecorded && (
            <span className="inline-block mt-2 text-xs text-blue-500">
              🎤 음성으로 작성됨
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
