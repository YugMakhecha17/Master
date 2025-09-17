import React from 'react';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/70 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl border border-border-primary dark:border-dark-border-primary w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium leading-6 text-content-primary dark:text-dark-content-primary" id="modal-title">
              {title}
            </h3>
            <button type="button" onClick={onClose} className="text-content-secondary dark:text-dark-content-secondary hover:text-content-primary">
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-content-secondary dark:text-dark-content-secondary">
              {message}
            </p>
          </div>
        </div>
        <div className="bg-background dark:bg-dark-surface/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full justify-center rounded-md border border-border-primary dark:border-dark-border-secondary bg-surface dark:bg-dark-border-primary px-4 py-2 text-base font-medium text-content-primary dark:text-dark-content-primary shadow-sm hover:bg-gray-50 dark:hover:bg-dark-border-secondary sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-danger px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:w-auto sm:text-sm"
          >
            <TrashIcon className="w-5 h-5" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};