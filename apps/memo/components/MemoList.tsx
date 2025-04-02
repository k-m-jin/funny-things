"use client";

import { useState, useEffect } from "react";
import { useMemoStore } from "@/store/memoStore";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ConfirmModal } from "./ConfirmModal";
import { AlertModal } from "./AlertModal";

export default function MemoList() {
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const { memos, isLoading, error, fetchMemos } = useMemoStore();

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        에러가 발생했습니다: {error.message}
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">저장된 메모가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <div
          key={memo.id}
          className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md"
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
              onClick={() => setMemoToDelete(memo.id)}
              className="text-gray-400 hover:text-red-500"
            >
              삭제
            </Button>
          </div>
          <p className="whitespace-pre-wrap text-gray-700">{memo.content}</p>
          <div className="mt-2 space-x-2">
            {memo.isVoiceRecorded && (
              <span className="inline-block text-xs text-blue-500">
                🎤 음성으로 작성됨
              </span>
            )}
            {memo.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs text-gray-500 hover:text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      <ConfirmModal
        isOpen={!!memoToDelete}
        onClose={() => setMemoToDelete(null)}
        onConfirm={() => {
          if (memoToDelete) {
            useMemoStore.getState().deleteMemo(memoToDelete);
            setShowAlert(true);
          }
        }}
        title="메모 삭제"
        message="정말로 이 메모를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        confirmVariant="destructive"
      />

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message="메모가 삭제되었습니다."
      />
    </div>
  );
}
