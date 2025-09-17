import React, { useState } from 'react';
import type { Ticket } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { XIcon } from './icons/XIcon';
import { MailIcon } from './icons/MailIcon';

interface EmailModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ ticket, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const subject = ticket.title;
  const body = ticket.description;
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ticket.assignedTo.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


  const Field = ({ label, value, fieldName }: { label: string, value: string, fieldName: string }) => (
    <div>
      <label className="block text-sm font-medium text-content-secondary">{label}</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow items-stretch focus-within:z-10">
          <input
            type="text"
            readOnly
            value={value}
            className="block w-full rounded-none rounded-l-md border-border-primary bg-background py-2 px-3 text-content-primary sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => handleCopy(value, fieldName)}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-border-primary bg-surface px-4 py-2 text-sm font-medium text-content-secondary hover:bg-background focus:border-oracle-red focus:outline-none focus:ring-1 focus:ring-oracle-red transition-colors"
        >
          <CopyIcon className="h-5 w-5" />
          <span className="w-16 text-left">{copiedField === fieldName ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
  
  const TextAreaField = ({ label, value, fieldName }: { label: string, value: string, fieldName: string }) => (
     <div>
      <label className="block text-sm font-medium text-content-secondary">{label}</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex-grow items-stretch focus-within:z-10">
          <textarea
            readOnly
            rows={5}
            value={value}
            className="block w-full rounded-none rounded-l-md border-border-primary bg-background py-2 px-3 text-content-primary sm:text-sm resize-none"
          />
        </div>
        <button
          type="button"
          onClick={() => handleCopy(value, fieldName)}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-border-primary bg-surface px-4 py-2 text-sm font-medium text-content-secondary hover:bg-background focus:border-oracle-red focus:outline-none focus:ring-1 focus:ring-oracle-red transition-colors"
        >
          <CopyIcon className="h-5 w-5" />
          <span className="w-16 text-left">{copiedField === fieldName ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-md shadow-xl border border-border-primary w-full max-w-2xl transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium leading-6 text-content-primary" id="modal-title">
              Email Ticket to {ticket.assignedTo.name}
            </h3>
            <button onClick={onClose} className="text-content-secondary hover:text-content-primary">
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-content-secondary">
              If your browser doesn't open an email app, you can copy the details below.
            </p>
            <Field label="To" value={ticket.assignedTo.email} fieldName="email" />
            <Field label="Subject" value={subject} fieldName="subject" />
            <TextAreaField label="Body" value={body} fieldName="body" />
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
           <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-oracle-red px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-oracle-red-dark focus:outline-none focus:ring-2 focus:ring-oracle-red focus:ring-offset-2 focus:ring-offset-surface sm:w-auto sm:text-sm"
          >
            <MailIcon className="w-5 h-5 mr-2" />
            Open in Gmail
          </a>
        </div>
      </div>
    </div>
  );
};