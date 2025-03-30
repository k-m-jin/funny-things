"use client";

import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
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
  cancelVariant?:
    | "destructive"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showCancel?: boolean;
  className?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  message = "계속 진행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "default",
  cancelVariant = "outline",
  showCancel = true,
  className,
}: ConfirmModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={className}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            {showCancel && (
              <Button variant={cancelVariant} onClick={onClose}>
                {cancelText}
              </Button>
            )}
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
