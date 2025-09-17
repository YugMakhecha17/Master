import React, { useState } from 'react';
import type { Department, DepartmentName, Employee } from '../types';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEmployee: Omit<Employee, 'id'>, department: DepartmentName) => void;
  departments: Department[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSubmit, departments }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<DepartmentName>(departments[0]?.name || 'Software');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !department) return;
    onSubmit({ name, email, role }, department);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-md shadow-xl border border-border-primary w-full max-w-lg transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-content-primary" id="modal-title">
                  Add New Employee
                </h3>
                <p className="text-sm text-content-secondary mt-1">
                  Enter the details for the new team member.
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-content-secondary hover:text-content-primary">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-content-secondary">Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
               <div>
                <label htmlFor="email" className="block text-sm font-medium text-content-secondary">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-content-secondary">Role / Specialty</label>
                <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} required placeholder="e.g., Senior Python Developer" className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-content-secondary">Department</label>
                <select id="department" value={department} onChange={e => setDepartment(e.target.value as DepartmentName)} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary">
                  {departments.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-background px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-md">
            <button type="button" onClick={onClose} className="inline-flex w-full justify-center rounded-md border border-border-primary bg-surface px-4 py-2 text-base font-medium text-content-primary shadow-sm hover:bg-gray-50 sm:w-auto sm:text-sm">
              Cancel
            </button>
            <button type="submit" className="inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-oracle-red px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-oracle-red-dark sm:w-auto sm:text-sm disabled:opacity-50">
              <UserIcon className="w-5 h-5"/>
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};