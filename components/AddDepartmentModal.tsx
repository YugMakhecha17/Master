import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (departmentName: string) => void;
  existingDepartments: string[];
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onSubmit, existingDepartments }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Department name cannot be empty.');
      return;
    }
    if (existingDepartments.some(d => d.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This department already exists.');
      return;
    }
    
    onSubmit(trimmedName);
    setName('');
    setError(null);
  };
  
  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-md shadow-xl border border-border-primary w-full max-w-lg transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-content-primary" id="modal-title">
                  Add New Department
                </h3>
                <p className="text-sm text-content-secondary mt-1">
                  Create a new team to assign tasks to.
                </p>
              </div>
              <button type="button" onClick={handleClose} className="text-content-secondary hover:text-content-primary">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-content-secondary">Department Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={e => {
                    setName(e.target.value);
                    setError(null);
                  }} 
                  required 
                  className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-danger mt-2">{error}</p>}
            </div>
          </div>
          <div className="bg-background px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-md">
            <button type="button" onClick={handleClose} className="inline-flex w-full justify-center rounded-md border border-border-primary bg-surface px-4 py-2 text-base font-medium text-content-primary shadow-sm hover:bg-gray-50 sm:w-auto sm:text-sm">
              Cancel
            </button>
            <button type="submit" className="inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-oracle-red px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-oracle-red-dark sm:w-auto sm:text-sm disabled:opacity-50">
              <BriefcaseIcon className="w-5 h-5"/>
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};