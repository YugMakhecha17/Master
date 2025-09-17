import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Department } from '../types';

interface ReassignTicketPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assigneeId: string) => void;
  anchorEl: HTMLElement | null;
  departments: Department[];
  currentAssigneeId: string;
}

export const ReassignTicketPopover: React.FC<ReassignTicketPopoverProps> = ({ isOpen, onClose, onSelect, anchorEl, departments, currentAssigneeId }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const popoverHeight = 400; // Estimated height
      const popoverWidth = 288; // w-72
      
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.left + window.scrollX;

      // Adjust if it goes off-screen
      if (top + popoverHeight > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - popoverHeight - 8;
      }
      if (left + popoverWidth > window.innerWidth + window.scrollX) {
        left = window.innerWidth + window.scrollX - popoverWidth - 16;
      }
      
      setPosition({ top, left });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && !anchorEl?.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, anchorEl, onClose]);

  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return departments
      .map(dept => ({
        ...dept,
        members: dept.members.filter(member =>
          member.name.toLowerCase().includes(lowercasedFilter)
        ),
      }))
      .filter(dept => dept.members.length > 0);
  }, [searchTerm, departments]);
  
  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-72 bg-surface dark:bg-dark-surface rounded-md shadow-lg border border-border-primary dark:border-dark-border-primary flex flex-col max-h-[400px] animate-fade-in-up"
      style={{ top: position.top, left: position.left }}
      role="dialog"
    >
      <div className="p-3 border-b border-border-primary dark:border-dark-border-secondary flex-shrink-0">
        <h3 className="text-sm font-semibold text-content-primary dark:text-dark-content-primary">Reassign Ticket</h3>
        <input
          type="text"
          placeholder="Search for an employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 w-full text-sm px-2 py-1.5 bg-background dark:bg-dark-background border border-border-primary dark:border-dark-border-secondary rounded-md focus:ring-1 focus:ring-oracle-red focus:border-oracle-red text-content-primary dark:text-dark-content-primary"
          autoFocus
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map(dept => (
            <div key={dept.name} className="py-2">
              <h4 className="px-3 pb-1 text-xs font-bold text-content-secondary dark:text-dark-content-secondary uppercase tracking-wider">{dept.name}</h4>
              <ul>
                {dept.members.map(member => (
                  <li key={member.id}>
                    <button
                      onClick={() => onSelect(member.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-background dark:hover:bg-dark-background ${
                        member.id === currentAssigneeId
                          ? 'bg-oracle-red/10 text-oracle-red font-semibold'
                          : 'text-content-primary dark:text-dark-content-primary'
                      }`}
                    >
                      <span>{member.name}</span>
                      {member.id === currentAssigneeId && <span className="text-xs font-bold">Current</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-content-secondary dark:text-dark-content-secondary text-center">No employees found.</p>
        )}
      </div>
    </div>
  );
};