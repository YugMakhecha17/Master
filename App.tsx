import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { DesireInputForm } from './components/DesireInputForm';
import { TaskBreakdown } from './components/TaskBreakdown';
import { ScrumBoard } from './components/ScrumBoard';
import { Loader } from './components/Loader';
import { EmailModal } from './components/EmailModal';
import { initiateProjectAnalysis } from './services/geminiService';
import type { SuggestedTask, Ticket, TicketStatus, Comment, DepartmentName, Employee } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS } from './constants';
import { ViewSwitcher } from './components/ViewSwitcher';
import { CommentModal } from './components/CommentModal';
import { ActivityFeed } from './components/ActivityFeed';
import { TeamSelection } from './components/TeamSelection';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { AddTicketModal } from './components/AddTicketModal';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { AddDepartmentModal } from './components/AddDepartmentModal';
import { EditEmployeeModal } from './components/EditEmployeeModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ReassignTicketPopover } from './components/ReassignTicketPopover';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicketForEmail, setSelectedTicketForEmail] = useState<Ticket | null>(null);
  const [currentView, setCurrentView] = useState<string>('Scrum Master');
  const [commentModalState, setCommentModalState] = useState<{ ticketId: string; newStatus: TicketStatus; fromStatus: TicketStatus } | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentName | 'All Teams'>('All Teams');
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [addTicketModalState, setAddTicketModalState] = useState<{ assigneeId: string } | null>(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<{ employee: Employee, departmentName: DepartmentName } | null>(null);
  const [confirmationState, setConfirmationState] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [reassignTicketState, setReassignTicketState] = useState<{ ticketId: string; anchorEl: HTMLElement; currentAssigneeId: string; } | null>(null);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleSelectDepartment = (department: DepartmentName | 'All Teams') => {
    setSelectedDepartment(department);
    setCurrentView('Scrum Master'); // Reset view to default when department changes
  };

  const { displayedEngineers, displayedTickets } = useMemo(() => {
    const allEngineers = departments.flatMap(d => d.members);
    
    if (selectedDepartment === 'All Teams') {
      return { 
        displayedEngineers: allEngineers, 
        displayedTickets: assignedTickets 
      };
    }

    const department = departments.find(d => d.name === selectedDepartment);
    const departmentEngineers = department?.members || [];
    const departmentMemberIds = new Set(departmentEngineers.map(e => e.id));
    const departmentTickets = assignedTickets.filter(t => departmentMemberIds.has(t.assignedTo.id));

    return { 
      displayedEngineers: departmentEngineers, 
      displayedTickets: departmentTickets
    };
  }, [selectedDepartment, assignedTickets, departments]);
  

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedTasks([]);

    try {
      const tasks = await initiateProjectAnalysis(description, departments);
      const tasksWithIds = tasks.map((task, index) => ({ ...task, id: `${Date.now()}-${index}` }));
      
      setSuggestedTasks(tasksWithIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToBacklog = (taskToAdd: SuggestedTask) => {
    const allEngineers = departments.flatMap(d => d.members);
    const assignee = allEngineers.find(member => member.id === taskToAdd.suggestedAssigneeId);

    if (!assignee) {
      console.error("Could not find assignee for task", taskToAdd);
      setError(`An internal error occurred: could not find the suggested assignee with ID '${taskToAdd.suggestedAssigneeId}'.`);
      return;
    }

    const newTicket: Ticket = {
      ...taskToAdd,
      assignedTo: assignee,
      dueDate: taskToAdd.suggestedDueDate,
      status: 'To Do',
      comments: [],
    };

    setAssignedTickets(prevTickets => [...prevTickets, newTicket]);
    setSuggestedTasks(prevTasks => prevTasks.filter(task => task.id !== taskToAdd.id));
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    const ticket = assignedTickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== newStatus) {
      setCommentModalState({ ticketId, newStatus, fromStatus: ticket.status });
    }
  };
  
  const handleConfirmStatusUpdate = (commentText: string) => {
    if (!commentModalState) return;

    const { ticketId, newStatus, fromStatus } = commentModalState;

    setAssignedTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const allEngineers = departments.flatMap(team => team.members);
          const author = currentView === 'Scrum Master' ? 'Scrum Master' : allEngineers.find(e => e.id === currentView)?.name || 'Unknown';
          
          const newComment: Comment = {
            author,
            text: commentText,
            timestamp: new Date().toISOString(),
            fromStatus: fromStatus,
            toStatus: newStatus,
          };

          return { 
            ...ticket, 
            status: newStatus, 
            comments: [...ticket.comments, newComment] 
          };
        }
        return ticket;
      })
    );
    setCommentModalState(null);
  };

  const handleUpdateTicketDueDate = (ticketId: string, newDueDate: string) => {
    setAssignedTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, dueDate: newDueDate, suggestedDueDate: newDueDate } : ticket
      )
    );
  };
  
  const handleInitiateReassign = (ticketId: string, anchorEl: HTMLElement) => {
    const ticket = assignedTickets.find(t => t.id === ticketId);
    if (ticket) {
      setReassignTicketState({
        ticketId,
        anchorEl,
        currentAssigneeId: ticket.assignedTo.id,
      });
    }
  };

  const handleConfirmReassign = (newAssigneeId: string) => {
    if (!reassignTicketState) return;

    const { ticketId } = reassignTicketState;
    let newAssignee: Employee | null = null;
    let newDepartmentName: DepartmentName | null = null;

    for (const dept of departments) {
      const member = dept.members.find(m => m.id === newAssigneeId);
      if (member) {
        newAssignee = member;
        newDepartmentName = dept.name;
        break;
      }
    }

    if (!newAssignee || !newDepartmentName) {
      console.error("Could not find new assignee to reassign ticket.");
      setReassignTicketState(null);
      return;
    }

    setAssignedTickets(prev => prev.map(ticket => 
      ticket.id === ticketId
        ? { 
            ...ticket, 
            assignedTo: newAssignee!, 
            suggestedAssigneeId: newAssignee!.id,
            suggestedDepartment: newDepartmentName! 
          }
        : ticket
    ));

    setReassignTicketState(null);
  };


  const handleRemoveTicket = (ticketIdToRemove: string) => {
    setAssignedTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketIdToRemove));
  };

  const handleEmailTicket = (ticket: Ticket) => {
    setSelectedTicketForEmail(ticket);
  };
  
  const handleCloseModal = () => {
    setSelectedTicketForEmail(null);
  }

  const handleAddTicket = (newTicketData: Omit<Ticket, 'id' | 'comments' | 'assignedTo'>, assigneeId: string) => {
    const allEngineers = departments.flatMap(d => d.members);
    const assignee = allEngineers.find(m => m.id === assigneeId);

    if (!assignee) {
        setError(`Could not add ticket: Assignee with ID ${assigneeId} not found.`);
        return;
    }
    
    const newTicket: Ticket = {
        ...newTicketData,
        id: `manual-${Date.now()}`,
        assignedTo: assignee,
        comments: [],
    };

    setAssignedTickets(prev => [...prev, newTicket]);
    setAddTicketModalState(null);
};

const handleAttemptRemoveEmployee = (employeeId: string) => {
    setConfirmationState({
        title: 'Remove Employee?',
        message: 'Are you sure you want to remove this employee? All their assigned tickets will also be permanently deleted.',
        onConfirm: () => {
            setDepartments(prevDepartments => {
                const updatedDepartments = prevDepartments.map(dept => ({
                    ...dept,
                    members: dept.members.filter(member => member.id !== employeeId)
                }));
                return updatedDepartments;
            });

            setAssignedTickets(prevTickets =>
                prevTickets.filter(ticket => ticket.assignedTo.id !== employeeId)
            );

            if (currentView === employeeId) {
                setCurrentView('Scrum Master');
            }
            setConfirmationState(null);
        }
    });
};

const handleAddEmployee = (newEmployee: Employee, departmentName: DepartmentName) => {
    const newEmployeeWithId = { ...newEmployee, id: `${newEmployee.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` };
    
    setDepartments(prevDepartments => {
        const departmentExists = prevDepartments.some(d => d.name === departmentName);
        
        if (departmentExists) {
            return prevDepartments.map(dept => 
                dept.name === departmentName 
                    ? { ...dept, members: [...dept.members, newEmployeeWithId] }
                    : dept
            );
        } else {
            return [...prevDepartments, { name: departmentName, members: [newEmployeeWithId] }];
        }
    });

    setIsAddEmployeeModalOpen(false);
};

const handleEditEmployee = (employee: Employee, departmentName: DepartmentName) => {
    setEditingEmployee({ employee, departmentName });
};

const handleUpdateEmployee = (updatedEmployee: Employee, newDepartmentName: DepartmentName, originalDepartmentName: DepartmentName) => {
    if (!editingEmployee) return;

    setDepartments(prev => {
        let employeeMoved = [...prev];
        
        // Remove from old department if it has changed
        if (originalDepartmentName !== newDepartmentName) {
            employeeMoved = employeeMoved.map(dept => {
                if (dept.name === originalDepartmentName) {
                    return { ...dept, members: dept.members.filter(m => m.id !== updatedEmployee.id) };
                }
                return dept;
            });
             // Add to new department
            employeeMoved = employeeMoved.map(dept => {
                if (dept.name === newDepartmentName) {
                    return { ...dept, members: [...dept.members, updatedEmployee] };
                }
                return dept;
            });
        } else {
            // Just update in place
            employeeMoved = employeeMoved.map(dept => {
                 if (dept.name === newDepartmentName) {
                    return {
                        ...dept,
                        members: dept.members.map(m => m.id === updatedEmployee.id ? updatedEmployee : m)
                    };
                }
                return dept;
            });
        }
        return employeeMoved;
    });

    setAssignedTickets(prev => prev.map(ticket => 
        ticket.assignedTo.id === updatedEmployee.id 
            ? { ...ticket, assignedTo: updatedEmployee, suggestedDepartment: newDepartmentName } 
            : ticket
    ));
    
    setEditingEmployee(null);
};


const handleAddDepartment = (departmentName: string) => {
    if (departments.some(d => d.name.toLowerCase() === departmentName.toLowerCase())) {
        setError(`Department "${departmentName}" already exists.`);
        return;
    }
    setDepartments(prev => [...prev, { name: departmentName.trim(), members: [] }]);
    setIsAddDepartmentModalOpen(false);
};

const handleAttemptRemoveDepartment = (departmentNameToRemove: string) => {
    setConfirmationState({
        title: `Remove ${departmentNameToRemove}?`,
        message: `Are you sure you want to remove the "${departmentNameToRemove}" department? This will also permanently delete all its members and their assigned tickets.`,
        onConfirm: () => {
            const departmentToRemove = departments.find(d => d.name === departmentNameToRemove);
            if (!departmentToRemove) return;

            const memberIdsToRemove = new Set(departmentToRemove.members.map(m => m.id));

            setDepartments(prev => prev.filter(d => d.name !== departmentNameToRemove));
            setAssignedTickets(prev => prev.filter(t => !memberIdsToRemove.has(t.assignedTo.id)));

            if (selectedDepartment === departmentNameToRemove) {
                setSelectedDepartment('All Teams');
            }
            setConfirmationState(null);
        }
    });
};


  return (
    <div className="bg-background min-h-screen text-content-primary dark:bg-dark-background dark:text-dark-content-primary transition-colors duration-300">
      <Header 
        onToggleDirectory={() => setIsDirectoryOpen(!isDirectoryOpen)}
        theme={theme}
        setTheme={setTheme}
      />
      <EmployeeDirectory 
        isOpen={isDirectoryOpen} 
        onClose={() => setIsDirectoryOpen(false)}
        departments={departments}
        onAddEmployee={() => setIsAddEmployeeModalOpen(true)}
        onRemoveEmployee={handleAttemptRemoveEmployee}
        onAddDepartment={() => setIsAddDepartmentModalOpen(true)}
        onRemoveDepartment={handleAttemptRemoveDepartment}
        onEditEmployee={handleEditEmployee}
       />
      <div className="flex flex-row items-start">
        <div className="flex-1 min-w-0">
          <TeamSelection 
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={handleSelectDepartment}
          />
          <main className="container mx-auto px-4 md:px-8 py-10">
            
            {currentView === 'Scrum Master' && selectedDepartment === 'All Teams' && (
              <div className="max-w-7xl mx-auto">
                <DesireInputForm
                  description={description}
                  setDescription={setDescription}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                />

                {isLoading && <Loader />}

                {error && (
                  <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-dark-danger px-4 py-3 rounded-md" role="alert">
                    <strong className="font-semibold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                  </div>
                )}

                {suggestedTasks.length > 0 && !isLoading && (
                  <TaskBreakdown tasks={suggestedTasks} onAddToBacklog={handleAddToBacklog} />
                )}
              </div>
            )}

            <div className="mt-12 mb-8 max-w-7xl mx-auto">
              <div className="flex flex-col xl:flex-row gap-6 items-start">
                 <div className="w-full md:w-auto">
                     <ViewSwitcher 
                      currentView={currentView}
                      setCurrentView={setCurrentView}
                      engineers={displayedEngineers}
                     />
                 </div>
                 {currentView === 'Scrum Master' && displayedTickets.length > 0 && (
                     <div className="flex-1 w-full">
                       <ActivityFeed tickets={displayedTickets} />
                     </div>
                 )}
              </div>
            </div>

            <div className="max-w-7xl mx-auto">
              <ScrumBoard 
                tickets={displayedTickets} 
                totalTickets={assignedTickets}
                onRemoveTicket={handleRemoveTicket}
                onEmailTicket={handleEmailTicket}
                onUpdateTicketStatus={handleUpdateTicketStatus}
                onUpdateTicketDueDate={handleUpdateTicketDueDate}
                onInitiateReassign={handleInitiateReassign}
                currentView={currentView}
                onAddTicket={(assigneeId) => setAddTicketModalState({ assigneeId })}
                onRemoveEmployee={handleAttemptRemoveEmployee}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </main>
        </div>
      </div>
      
      {selectedTicketForEmail && (
        <EmailModal ticket={selectedTicketForEmail} onClose={handleCloseModal} />
      )}
      
      {commentModalState && (
        <CommentModal
          ticket={assignedTickets.find(t => t.id === commentModalState.ticketId)!}
          newStatus={commentModalState.newStatus}
          onClose={() => setCommentModalState(null)}
          onSubmit={handleConfirmStatusUpdate}
        />
      )}

      {addTicketModalState && (
        <AddTicketModal 
          isOpen={!!addTicketModalState}
          onClose={() => setAddTicketModalState(null)}
          onSubmit={handleAddTicket}
          assigneeId={addTicketModalState.assigneeId}
          departments={departments}
        />
      )}

      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          isOpen={isAddEmployeeModalOpen}
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onSubmit={handleAddEmployee}
          departments={departments}
        />
      )}

      {isAddDepartmentModalOpen && (
        <AddDepartmentModal
          isOpen={isAddDepartmentModalOpen}
          onClose={() => setIsAddDepartmentModalOpen(false)}
          onSubmit={handleAddDepartment}
          existingDepartments={departments.map(d => d.name)}
        />
      )}

      {editingEmployee && (
        <EditEmployeeModal
            isOpen={!!editingEmployee}
            onClose={() => setEditingEmployee(null)}
            onSubmit={handleUpdateEmployee}
            employeeToEdit={editingEmployee.employee}
            originalDepartmentName={editingEmployee.departmentName}
            departments={departments}
        />
      )}

      {confirmationState && (
        <ConfirmationModal
            isOpen={!!confirmationState}
            onClose={() => setConfirmationState(null)}
            onConfirm={confirmationState.onConfirm}
            title={confirmationState.title}
            message={confirmationState.message}
        />
      )}

      {reassignTicketState && (
        <ReassignTicketPopover
          isOpen={!!reassignTicketState}
          onClose={() => setReassignTicketState(null)}
          onSelect={handleConfirmReassign}
          anchorEl={reassignTicketState.anchorEl}
          departments={departments}
          currentAssigneeId={reassignTicketState.currentAssigneeId}
        />
      )}

    </div>
  );
};

export default App;