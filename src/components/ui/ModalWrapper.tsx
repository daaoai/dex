'use client';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  withBlur?: boolean;
}

const ModalWrapper: React.FC<ModalProps> = ({ isOpen, onClose, children, className, withBlur = true }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className={clsx('fixed inset-0 flex items-center w-full justify-center py-4 pt-8 px-6 z-10', {
        ' backdrop-blur-xs': withBlur,
        'bg-transparent': !withBlur,
      })}
    >
      <div
        ref={modalRef}
        className={clsx('relative shadow-lg w-full max-w-xl rounded-lg flex justify-center items-center', className)}
      >
        {children}
      </div>
    </div>
  );
};

export { ModalWrapper };
