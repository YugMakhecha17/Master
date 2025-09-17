import React, { useMemo } from 'react';
import type { SuggestedTask, Employee, DepartmentName } from '../types';
import { DEPARTMENTS } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PriorityIcon } from './icons/PriorityIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { StarIcon } from './icons/StarIcon';

interface TaskCardProps {
  task: SuggestedTask;
  onAddToBacklog: (ticket: SuggestedTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onAddToBacklog }) => {
  const assignee = useMemo((): Employee | undefined => {
    // Note: This relies on the initial DEPARTMENTS constant. For a fully dynamic app,
    // the complete departments list should be passed down from App.tsx.
    // However, for finding an assignee by ID, this should still work as long as the ID is unique.
    const allEngineers = DEPARTMENTS.flatMap(d => d.members);
    return allEngineers.find(member => member.id === task.suggestedAssigneeId);
  }, [task.suggestedAssigneeId]);

  const handleAdd = () => {
    if (assignee) {
      onAddToBacklog(task);
    } else {
      // This might fail if a new employee was added to a new department not in constants.
      // A more robust solution would be to pass all current departments from App state.
      console.error('Could not find the suggested assignee. Cannot assign ticket.');
    }
  };

  const getDepartmentColor = (departmentName: DepartmentName) => {
    const commonClasses = "border";
    switch (departmentName) {
      case 'Software': return `${commonClasses} bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800`;
      case 'Operations': return `${commonClasses} bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800`;
      case 'HR': return `${commonClasses} bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800`;
      case 'Marketing': return `${commonClasses} bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800`;
      case 'Design': return `${commonClasses} bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800`;
      case 'Sales': return `${commonClasses} bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800`;
      default: return `${commonClasses} bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`;
    }
  }

  const getPriorityInfo = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return { textClass: 'text-danger dark:text-dark-danger', borderClass: 'border-danger dark:border-dark-danger' };
      case 'Medium': return { textClass: 'text-warning dark:text-dark-warning', borderClass: 'border-warning dark:border-dark-warning' };
      case 'Low': return { textClass: 'text-sky-500 dark:text-sky-400', borderClass: 'border-sky-500 dark:border-sky-500' };
      default: return { textClass: 'text-content-secondary dark:text-dark-content-secondary', borderClass: 'border-border-primary dark:border-dark-border-primary' };
    }
  };

  if (!assignee) {
     console.warn(`Assignee with ID ${task.suggestedAssigneeId} not found for task: "${task.title}". This may happen if the employee belongs to a newly created department. The task card will not be rendered.`);
    return null;
  }

  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <div className={`bg-surface dark:bg-dark-surface p-5 rounded-lg border border-border-primary dark:border-dark-border-primary shadow-sm transition-all duration-300 hover:shadow-lg hover:border-oracle-red/50 relative border-l-4 ${priorityInfo.borderClass}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Main Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-content-primary dark:text-dark-content-primary pr-24">{task.title}</h3>
          <p className="mt-2 text-sm text-content-secondary dark:text-dark-content-secondary leading-relaxed">{task.description}</p>
        </div>

        {/* Top Right Metadata */}
        <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
          <div className={`text-xs font-bold px-3 py-1 rounded-full ${getDepartmentColor(task.suggestedDepartment)}`}>
            {task.suggestedDepartment}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-border-primary text-gray-700 dark:text-dark-content-primary font-medium text-xs px-2 py-1 rounded-full border border-border-primary dark:border-dark-border-secondary shadow-sm" title={`${task.storyPoints} Story Points`}>
            <StarIcon className="w-3.5 h-3.5 text-yellow-500" />
            <span>{task.storyPoints}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-border-primary dark:border-dark-border-primary flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Bottom Left Metadata */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm w-full">
           <div className="flex items-center gap-2" title={`Suggested Assignee: ${assignee.name}`}>
            <UserIcon className="w-4 h-4 text-content-secondary dark:text-dark-content-secondary" />
            <span className="font-medium text-content-primary dark:text-dark-content-primary">{assignee.name}</span>
          </div>
          <div className="flex items-center gap-2" title={`Suggested Due Date: ${task.suggestedDueDate}`}>
            <CalendarIcon className="w-4 h-4 text-content-secondary dark:text-dark-content-secondary" />
            <span className="font-medium text-content-primary dark:text-dark-content-primary">{new Date(task.suggestedDueDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2" title={`Suggested Priority: ${task.priority}`}>
            <PriorityIcon className={`w-4 h-4 ${priorityInfo.textClass}`} />
            <span className={`font-medium ${priorityInfo.textClass}`}>{task.priority}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="w-full md:w-auto flex-shrink-0">
            <button
              onClick={handleAdd}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-oracle-red text-white font-semibold text-sm rounded-md shadow-md hover:bg-oracle-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oracle-red transition-all duration-300 transform hover:scale-105"
            >
             <PlusCircleIcon className="w-5 h-5" />
             Add to Backlog
            </button>
        </div>

      </div>
    </div>
  );
};