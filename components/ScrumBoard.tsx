import React from 'react';
import type { Ticket, TicketStatus, DepartmentName } from '../types';
import { TicketCard } from './TicketCard';
import { ProgressBar } from './ProgressBar';
import { DEPARTMENTS } from '../constants';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ScrumBoardProps {
  tickets: Ticket[];
  totalTickets: Ticket[];
  onRemoveTicket: (ticketId: string) => void;
  onEmailTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onUpdateTicketDueDate: (ticketId: string, newDueDate: string) => void;
  onInitiateReassign: (ticketId: string, anchorEl: HTMLElement) => void;
  onAddTicket: (assigneeId: string) => void;
  onRemoveEmployee: (employeeId: string) => void;
  currentView: string;
  selectedDepartment: DepartmentName | 'All Teams';
}

const BoardColumn: React.FC<{
  title: TicketStatus;
  tickets: Ticket[];
  onRemoveTicket: (ticketId: string) => void;
  onEmailTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onUpdateTicketDueDate: (ticketId: string, newDueDate: string) => void;
  onInitiateReassign: (ticketId: string, anchorEl: HTMLElement) => void;
  currentView: string;
}> = ({ title, tickets, ...props }) => {
  const columnStyles = {
    'To Do': { dot: 'bg-blue-500' },
    'In Progress': { dot: 'bg-yellow-500' },
    'Done': { dot: 'bg-green-500' },
  };

  return (
    <div className="bg-background dark:bg-dark-background/50 rounded-lg flex-1 min-w-[320px] max-w-md flex flex-col border border-border-primary dark:border-dark-border-primary">
      <div className="flex items-center justify-between p-4 border-b border-border-primary dark:border-dark-border-primary">
        <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${columnStyles[title].dot}`}></span>
            <h3 className="text-md font-semibold text-content-primary dark:text-dark-content-primary tracking-widest uppercase">{title}</h3>
        </div>
        <span className="bg-gray-200 dark:bg-dark-surface text-content-secondary dark:text-dark-content-primary font-medium text-sm px-3 py-1 rounded-full">{tickets.length}</span>
      </div>
      <div className="p-2 space-y-3 h-full overflow-y-auto">
        {tickets.length > 0 ? (
            tickets.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onRemove={props.onRemoveTicket} 
                onEmail={props.onEmailTicket} 
                onUpdateTicketStatus={props.onUpdateTicketStatus}
                onUpdateTicketDueDate={props.onUpdateTicketDueDate}
                onInitiateReassign={props.onInitiateReassign}
                currentView={props.currentView}
              />
            ))
        ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-content-secondary/70 dark:text-dark-content-secondary/50 text-sm p-4 text-center italic">This column is empty.</p>
            </div>
        )}
      </div>
    </div>
  );
};


export const ScrumBoard: React.FC<ScrumBoardProps> = ({ tickets, totalTickets, onRemoveTicket, onEmailTicket, onUpdateTicketStatus, onUpdateTicketDueDate, onInitiateReassign, currentView, onAddTicket, onRemoveEmployee, selectedDepartment }) => {
  
  const allEngineers = DEPARTMENTS.flatMap(dept => dept.members);
  const currentEngineer = allEngineers.find(e => e.id === currentView);
  
  const columnProps = { onRemoveTicket, onEmailTicket, onUpdateTicketStatus, onUpdateTicketDueDate, onInitiateReassign, currentView };
  
  const totalProgressPercentage = totalTickets.length > 0 ? (totalTickets.filter(t => t.status === 'Done').length / totalTickets.length) * 100 : 0;
  const isDepartmentView = currentView === 'Scrum Master' && selectedDepartment !== 'All Teams';
  const departmentProgressPercentage = tickets.length > 0 ? (tickets.filter(t => t.status === 'Done').length / tickets.length) * 100 : 0;


  const displayedTicketsForView = currentView === 'Scrum Master'
    ? tickets
    : tickets.filter(t => t.assignedTo.id === currentView);

  const EmptyState: React.FC = () => {
    if (totalTickets.length === 0) {
      return (
        <div className="text-center py-12 bg-surface dark:bg-dark-surface rounded-lg border-2 border-dashed border-border-primary dark:border-dark-border-primary">
          <p className="text-content-secondary dark:text-dark-content-secondary">No tickets have been added to the backlog yet.</p>
          <p className="text-sm text-content-secondary/70 dark:text-dark-content-secondary/70 mt-1">Use the form above to get started.</p>
        </div>
      );
    }
    if (displayedTicketsForView.length === 0 && currentEngineer) {
      return (
        <div className="text-center py-12 bg-surface dark:bg-dark-surface rounded-lg border-2 border-dashed border-border-primary dark:border-dark-border-primary">
          <p className="text-content-secondary dark:text-dark-content-secondary">No tickets are assigned to {currentEngineer.name}.</p>
          <p className="text-sm text-content-secondary/70 dark:text-dark-content-secondary/70 mt-1">Switch to the Scrum Master view to see all tickets in this department.</p>
        </div>
      );
    }
     if (displayedTicketsForView.length === 0 && currentView === 'Scrum Master') {
      return (
        <div className="text-center py-12 bg-surface dark:bg-dark-surface rounded-lg border-2 border-dashed border-border-primary dark:border-dark-border-primary">
          <p className="text-content-secondary dark:text-dark-content-secondary">No tickets found for the selected department.</p>
          <p className="text-sm text-content-secondary/70 dark:text-dark-content-secondary/70 mt-1">Select another department or "All Teams" to view tickets.</p>
        </div>
      );
    }
    return null;
  }


  return (
    <section className="mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium text-content-primary dark:text-dark-content-primary flex items-center gap-3">
          <span className="text-oracle-red font-semibold">3.</span>
          <span className="uppercase tracking-wider">Scrum Board</span>
        </h2>
        {totalTickets.length > 0 && currentView === 'Scrum Master' && (
          <div className="w-full md:w-1/2">
             {isDepartmentView ? (
              <ProgressBar percentage={departmentProgressPercentage} title={`${selectedDepartment} Progress`} />
            ) : (
              <ProgressBar percentage={totalProgressPercentage} title="Overall Project Progress" />
            )}
          </div>
        )}
      </div>
      {displayedTicketsForView.length === 0 ? (
        <EmptyState />
      ) : (
        currentView === 'Scrum Master' ? (
          <div className="space-y-12">
            {[...new Map(displayedTicketsForView.map(t => [t.assignedTo.id, t.assignedTo])).values()]
            .sort((a, b) => a.name.localeCompare(b.name)) // Sorting for consistent order
            .map(assignee => {
              const assigneeTickets = displayedTicketsForView.filter(t => t.assignedTo.id === assignee.id);
              if (assigneeTickets.length === 0) return null;

              const progressPercentage = (assigneeTickets.filter(t => t.status === 'Done').length / assigneeTickets.length) * 100;
              const todoTickets = assigneeTickets.filter(t => t.status === 'To Do');
              const inProgressTickets = assigneeTickets.filter(t => t.status === 'In Progress');
              const doneTickets = assigneeTickets.filter(t => t.status === 'Done');

              return (
                <div key={assignee.id} className="bg-surface dark:bg-dark-surface p-4 sm:p-6 rounded-lg border border-border-primary dark:border-dark-border-primary">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <h3 className="text-lg font-semibold text-content-primary dark:text-dark-content-primary">{assignee.name}'s Tasks</h3>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-full flex-grow md:w-64">
                          <ProgressBar percentage={progressPercentage} title="Assignee Progress" />
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => onAddTicket(assignee.id)} 
                                title="Add New Ticket" 
                                className="p-2 text-content-secondary/70 dark:text-dark-content-secondary hover:text-oracle-red dark:hover:text-oracle-red transition-colors rounded-full hover:bg-oracle-red/10 dark:hover:bg-oracle-red/20"
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => onRemoveEmployee(assignee.id)} 
                                title="Remove Employee" 
                                className="p-2 text-content-secondary/70 dark:text-dark-content-secondary hover:text-danger dark:hover:text-dark-danger transition-colors rounded-full hover:bg-danger/10 dark:hover:bg-dark-danger/20"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <BoardColumn title="To Do" tickets={todoTickets} {...columnProps} />
                    <BoardColumn title="In Progress" tickets={inProgressTickets} {...columnProps} />
                    <BoardColumn title="Done" tickets={doneTickets} {...columnProps} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <BoardColumn title="To Do" tickets={displayedTicketsForView.filter(t => t.status === 'To Do')} {...columnProps} />
            <BoardColumn title="In Progress" tickets={displayedTicketsForView.filter(t => t.status === 'In Progress')} {...columnProps} />
            <BoardColumn title="Done" tickets={displayedTicketsForView.filter(t => t.status === 'Done')} {...columnProps} />
          </div>
        )
      )}
    </section>
  );
};