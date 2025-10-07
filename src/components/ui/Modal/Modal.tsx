// src/components/ui/Modal/Modal.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={clsx(
          'bg-white rounded-lg shadow-xl w-full max-w-md mx-4',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}