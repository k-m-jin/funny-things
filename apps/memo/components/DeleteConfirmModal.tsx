"use client";

import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?:
    | "destructive"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "삭제 확인",
  message = "정말로 삭제하시겠습니까?",
  confirmText = "삭제",
  cancelText = "취소",
  confirmVariant = "destructive",
}: DeleteConfirmModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
