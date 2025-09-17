export type DepartmentName = string;

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Department {
  name: DepartmentName;
  members: Employee[];
}

export interface SuggestedTask {
  id:string;
  title: string;
  description: string;
  suggestedDepartment: DepartmentName;
  suggestedAssigneeId: string;
  suggestedDueDate: string; // YYYY-MM-DD format
  priority: 'Low' | 'Medium' | 'High';
  storyPoints: number;
}

export type TicketStatus = 'To Do' | 'In Progress' | 'Done';

export interface Comment {
  author: string;
  text: string;
  timestamp: string; // ISO 8601 format
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
}


export interface Ticket extends SuggestedTask {
  assignedTo: Employee;
  dueDate: string; // YYYY-MM-DD format
  status: TicketStatus;
  comments: Comment[];
}

// Fix: Added missing ChatMessage type for the ProjectChat component.
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
