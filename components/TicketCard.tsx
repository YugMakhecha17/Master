import React, { useState } from 'react';
import type { Ticket, DepartmentName, TicketStatus } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MailIcon } from './icons/MailIcon';
import { PriorityIcon } from './icons/PriorityIcon';
import { ArrowRightCircleIcon } from './icons/ArrowRightCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArrowLeftCircleIcon } from './icons/ArrowLeftCircleIcon';
import { EditIcon } from './icons/EditIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface TicketCardProps {
  ticket: Ticket;
  onRemove: (ticketId: string) => void;
  onEmail: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onUpdateTicketDueDate: (ticketId: string, newDueDate: string) => void;
  onInitiateReassign: (ticketId: string, anchorEl: HTMLElement) => void;
  currentView: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onRemove, onEmail, onUpdateTicketStatus, onUpdateTicketDueDate, onInitiateReassign, currentView }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const isScrumMasterView = currentView === 'Scrum Master';

  const getDepartmentColor = (departmentName: DepartmentName) => {
    switch (departmentName) {
      case 'Software': return 'bg-blue-500';
      case 'Operations': return 'bg-green-500';
      case 'HR': return 'bg-purple-500';
      case 'Marketing': return 'bg-pink-500';
      case 'Design': return 'bg-indigo-500';
      case 'Sales': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }
  
  const getPriorityInfo = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'text-danger dark:text-dark-danger';
      case 'Medium': return 'text-warning dark:text-dark-warning';
      case 'Low': return 'text-sky-500 dark:text-sky-400';
      default: return 'text-content-secondary dark:text-dark-content-secondary';
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        onUpdateTicketDueDate(ticket.id, e.target.value);
        setIsEditingDate(false);
    }
  };

  const priorityColor = getPriorityInfo(ticket.priority);

  const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, title: string }> = ({ onClick, children, className, title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-1 text-content-secondary/70 dark:text-dark-content-secondary hover:text-oracle-red dark:hover:text-oracle-red transition-colors duration-200 ${className}`}
        aria-label={title}
    >
        {children}
    </button>
  );
  
  const latestComment = ticket.comments.length > 0 ? ticket.comments[ticket.comments.length - 1] : null;

  return (
    <div className={`bg-surface dark:bg-dark-surface rounded-lg shadow-sm border border-border-primary dark:border-dark-border-secondary flex flex-col h-full group transition-all duration-200 hover:border-oracle-red dark:hover:border-oracle-red/70 hover:shadow-md`}>
      <div className="p-4 flex-grow flex flex-col">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex items-center gap-2 flex-grow pr-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getDepartmentColor(ticket.suggestedDepartment)} flex-shrink-0`} title={`Department: ${ticket.suggestedDepartment}`}></span>
              <h3 className="font-semibold text-md text-content-primary dark:text-dark-content-primary leading-tight">{ticket.title}</h3>
            </div>
            <div className="flex-shrink-0 bg-gray-100 dark:bg-dark-background text-gray-700 dark:text-dark-content-primary font-medium text-xs w-8 h-8 rounded-full flex items-center justify-center border border-border-primary dark:border-dark-border-secondary shadow-sm" title={`${ticket.storyPoints} Story Points`}>
                {ticket.storyPoints}
            </div>
        </div>
        
        {/* Description & Comment */}
        <div className="flex-grow">
          <p className="text-content-secondary dark:text-dark-content-secondary text-sm mb-3 text-ellipsis overflow-hidden" style={{ maxHeight: '3rem' }}>{ticket.description}</p>
          
          {latestComment && (
            <div className="mb-3 text-xs border-t border-border-primary dark:border-dark-border-primary pt-2">
                <div className="flex items-start gap-2 text-content-secondary/80 dark:text-dark-content-secondary">
                    <MessageSquareIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">
                          Latest from <span className="font-semibold text-content-primary/90 dark:text-dark-content-primary">{latestComment.author}</span>:
                      </p>
                      <p className="italic text-content-secondary dark:text-dark-content-primary mt-0.5 bg-background dark:bg-dark-background p-2 rounded-md border border-border-primary dark:border-dark-border-secondary">"{latestComment.text}"</p>
                    </div>
                </div>
            </div>
          )}
        </div>
        
        {/* Card Footer */}
        <div className="flex justify-between items-center text-sm text-content-secondary dark:text-dark-content-secondary border-t border-border-primary dark:border-dark-border-primary pt-3">
          {isScrumMasterView ? (
            <button
              onClick={(e) => onInitiateReassign(ticket.id, e.currentTarget)}
              className="flex items-center gap-2 group/assignee p-1 -ml-1 rounded-md hover:bg-background dark:hover:bg-dark-background"
              title={`Assigned to ${ticket.assignedTo.name}. Click to reassign.`}
            >
              <UserIcon className="w-4 h-4 text-oracle-red" />
              <span className="font-medium text-content-primary dark:text-dark-content-primary">{ticket.assignedTo.name}</span>
              <ChevronDownIcon className="w-4 h-4 text-content-secondary/50 dark:text-dark-content-secondary/50 opacity-0 group-hover/assignee:opacity-100 transition-opacity" />
            </button>
          ) : (
            <div className="flex items-center gap-2" title={`Assigned to ${ticket.assignedTo.name}`}>
              <UserIcon className="w-4 h-4 text-oracle-red"/>
              <span className="font-medium text-content-primary dark:text-dark-content-primary">{ticket.assignedTo.name}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5" title={`Priority: ${ticket.priority}`}>
                <PriorityIcon className={`w-4 h-4 ${priorityColor}`} />
             </div>
             <div className="flex items-center gap-1.5 relative" title={`Due: ${ticket.dueDate}`}>
                {isEditingDate ? (
                  <input
                    type="date"
                    defaultValue={ticket.dueDate}
                    onChange={handleDateChange}
                    onBlur={() => setIsEditingDate(false)}
                    autoFocus
                    className="bg-surface dark:bg-dark-surface border border-border-primary dark:border-dark-border-secondary rounded-md text-content-primary dark:text-dark-content-primary text-sm p-1 w-[135px]"
                  />
                ) : (
                  <button onClick={() => isScrumMasterView && setIsEditingDate(true)} className={`flex items-center gap-1.5 group/date p-1 rounded-md ${isScrumMasterView ? 'hover:bg-background dark:hover:bg-dark-background cursor-pointer' : 'cursor-default'}`}>
                    <CalendarIcon className="w-4 h-4"/>
                    <span className="dark:text-dark-content-primary">{new Date(ticket.dueDate + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    {isScrumMasterView && <EditIcon className="w-3 h-3 text-content-secondary/50 dark:text-dark-content-secondary/50 opacity-0 group-hover/date:opacity-100 transition-opacity" />}
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-background dark:bg-dark-surface/50 px-3 py-1 border-t border-border-primary dark:border-dark-border-primary flex justify-between items-center rounded-b-lg">
        {isScrumMasterView ? (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ActionButton onClick={() => onEmail(ticket)} title="Email Assignee">
                    <MailIcon className="w-5 h-5" />
                </ActionButton>
                <ActionButton onClick={() => onRemove(ticket.id)} title="Remove Ticket" className="hover:text-danger dark:hover:text-dark-danger">
                    <TrashIcon className="w-5 h-5" />
                </ActionButton>
            </div>
        ) : <div />}
        <div className="flex items-center gap-2">
            {ticket.status !== 'To Do' && (
                <ActionButton onClick={() => onUpdateTicketStatus(ticket.id, ticket.status === 'Done' ? 'In Progress' : 'To Do')} title="Move Back">
                    <ArrowLeftCircleIcon className="w-6 h-6"/>
                </ActionButton>
            )}
             {ticket.status !== 'Done' && (
                 <ActionButton onClick={() => onUpdateTicketStatus(ticket.id, ticket.status === 'To Do' ? 'In Progress' : 'Done')} title={ticket.status === 'To Do' ? 'Start Progress' : 'Mark as Done'}>
                    {ticket.status === 'To Do' 
                        ? <ArrowRightCircleIcon className="w-6 h-6 text-gray-500 dark:text-dark-content-secondary hover:text-yellow-500 dark:hover:text-dark-warning"/> 
                        : <CheckCircleIcon className="w-6 h-6 text-gray-500 dark:text-dark-content-secondary hover:text-green-500 dark:hover:text-dark-success"/>
                    }
                </ActionButton>
            )}
        </div>
      </div>
    </div>
  );
};