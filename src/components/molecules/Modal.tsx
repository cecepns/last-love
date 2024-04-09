import React, { ReactNode, memo, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Icon } from '@/components/atoms';

interface ModalProps {
  className?: string;
  closeOutside?: boolean;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = memo(
  ({ isOpen, onClose, className, children, closeOutside = true }) => {

    const selectRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          console.log(closeOutside);
          if(closeOutside) {
            onClose();
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [closeOutside, onClose]);

    const wrapperClass = classNames('fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out', {
      'overflow-hidden opacity-100 pointer-events-auto': isOpen,
      'opacity-0 pointer-events-none': !isOpen,
      [`${className}`]: !!className,
    });
      
    return (
      <div
        className={wrapperClass}
      >
        <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>
      
        <div className="modal relative w-auto my-6 mx-auto">
          <div className="modal-content bg-white shadow-lg rounded-lg p-5" ref={selectRef}>
            <button
              className="absolute flex items-center bg-primary rounded-full p-2 w-[35px] h-[35px] top-0 right-0 m-3 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <Icon name="xmark" className="text-white" />
            </button>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

