"use client";

import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function AlertModal({ isOpen, onClose, message }: AlertModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <div className="text-center">
          <p className="mb-6">{message}</p>
          <div className="flex justify-center">
            <Button onClick={onClose}>확인</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
