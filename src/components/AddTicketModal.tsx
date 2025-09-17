import React, { useState, useMemo } from 'react';
import type { Ticket, Department, DepartmentName } from '../types';
import { XIcon } from './icons/XIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTicketData: Omit<Ticket, 'id' | 'comments' | 'assignedTo'>, assigneeId: string) => void;
  assigneeId: string;
  departments: Department[];
}

export const AddTicketModal: React.FC<AddTicketModalProps> = ({ isOpen, onClose, onSubmit, assigneeId, departments }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [storyPoints, setStoryPoints] = useState<number>(3);

  const assigneeInfo = useMemo(() => {
    for (const dept of departments) {
      const member = dept.members.find(m => m.id === assigneeId);
      if (member) {
        return { ...member, departmentName: dept.name };
      }
    }
    return null;
  }, [assigneeId, departments]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assigneeInfo) return;

    // FIX: Added missing 'status' property, which is required for a new ticket.
    onSubmit({
      title,
      description,
      suggestedDueDate: dueDate,
      dueDate: dueDate,
      priority,
      storyPoints,
      status: 'To Do',
      suggestedAssigneeId: assigneeId,
      suggestedDepartment: assigneeInfo.departmentName
    }, assigneeId);
  };

  if (!isOpen || !assigneeInfo) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-md shadow-xl border border-border-primary w-full max-w-2xl transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-content-primary" id="modal-title">
                  Add New Ticket
                </h3>
                <p className="text-sm text-content-secondary mt-1">
                  For: <span className="font-medium">{assigneeInfo.name}</span> ({assigneeInfo.departmentName})
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-content-secondary hover:text-content-primary">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-content-secondary">Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-content-secondary">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary resize-y" />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-content-secondary">Due Date</label>
                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-content-secondary">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as 'Low' | 'Medium' | 'High')} required className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
               <div className="md:col-span-2">
                <label htmlFor="storyPoints" className="block text-sm font-medium text-content-secondary">Story Points</label>
                <input type="number" id="storyPoints" value={storyPoints} onChange={e => setStoryPoints(parseInt(e.target.value, 10))} required min="1" className="mt-1 block w-full rounded-md bg-surface border-border-primary shadow-sm focus:border-oracle-red focus:ring-oracle-red sm:text-sm text-content-primary" />
              </div>
            </div>
          </div>
          <div className="bg-background px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-md">
            <button type="button" onClick={onClose} className="inline-flex w-full justify-center rounded-md border border-border-primary bg-surface px-4 py-2 text-base font-medium text-content-primary shadow-sm hover:bg-gray-50 sm:w-auto sm:text-sm">
              Cancel
            </button>
            <button type="submit" className="inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-oracle-red px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-oracle-red-dark sm:w-auto sm:text-sm disabled:opacity-50">
              <PlusCircleIcon className="w-5 h-5"/>
              Add Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};