import React, { useState } from 'react';
import type { Ticket, TicketStatus } from '../types';
import { XIcon } from './icons/XIcon';
import { ArrowRightCircleIcon } from './icons/ArrowRightCircleIcon';

interface CommentModalProps {
  ticket: Ticket;
  newStatus: TicketStatus;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({ ticket, newStatus, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-md shadow-xl border border-border-primary w-full max-w-lg transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-content-primary" id="modal-title">
                  Update Ticket Status
                </h3>
                <p className="text-sm text-content-secondary mt-1 truncate max-w-md" title={ticket.title}>
                  Ticket: <span className="font-medium">{ticket.title}</span>
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-content-secondary hover:text-content-primary">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 bg-background p-3 rounded-lg">
                <span className="text-sm font-semibold px-3 py-1 bg-gray-200 text-gray-800 rounded-full">{ticket.status}</span>
                <ArrowRightCircleIcon className="w-6 h-6 text-content-secondary" />
                <span className={`text-sm font-semibold px-3 py-1 ${newStatus === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded-full`}>{newStatus}</span>
            </div>
            <div className="mt-4">
              <label htmlFor="comment" className="block text-sm font-medium text-content-secondary">
                Add a comment (required)
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary resize-y"
                placeholder="e.g., 'Started working on the API endpoints...'"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="bg-background px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-md">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md border border-border-primary bg-surface px-4 py-2 text-base font-medium text-content-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-oracle-red-dark focus:ring-offset-2 focus:ring-offset-surface sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-oracle-red px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-oracle-red-dark focus:outline-none focus:ring-2 focus:ring-oracle-red focus:ring-offset-2 focus:ring-offset-surface sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
