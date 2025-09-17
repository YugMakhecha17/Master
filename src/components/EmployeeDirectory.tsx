import React, { useEffect } from 'react';
import type { Department, DepartmentName, Employee } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { XIcon } from './icons/XIcon';
import { SoftwareIcon } from './icons/SoftwareIcon';
import { OperationsIcon } from './icons/OperationsIcon';
import { HRIcon } from './icons/HRIcon';
import { MarketingIcon } from './icons/MarketingIcon';
import { DesignIcon } from './icons/DesignIcon';
import { SalesIcon } from './icons/SalesIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { EditIcon } from './icons/EditIcon';

interface EmployeeDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onAddEmployee: () => void;
  onRemoveEmployee: (employeeId: string) => void;
  onEditEmployee: (employee: Employee, departmentName: DepartmentName) => void;
  onAddDepartment: () => void;
  onRemoveDepartment: (departmentName: string) => void;
}

const PRESET_ICONS: Record<string, React.ReactNode> = {
    Software: <SoftwareIcon className="w-5 h-5" />,
    Operations: <OperationsIcon className="w-5 h-5" />,
    HR: <HRIcon className="w-5 h-5" />,
    Marketing: <MarketingIcon className="w-5 h-5" />,
    Design: <DesignIcon className="w-5 h-5" />,
    Sales: <SalesIcon className="w-5 h-5" />,
};

const getDepartmentIcon = (departmentName: DepartmentName) => {
    return PRESET_ICONS[departmentName] || <SettingsIcon className="w-5 h-5" />;
};


export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ isOpen, onClose, departments, onAddEmployee, onRemoveEmployee, onEditEmployee, onAddDepartment, onRemoveDepartment }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/50 dark:bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-surface dark:bg-dark-surface shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="directory-title"
      >
        <div className="p-6 border-b border-border-primary dark:border-dark-border-primary flex-shrink-0">
            <div className="flex items-center justify-between">
            <h2 id="directory-title" className="text-lg font-semibold text-content-primary dark:text-dark-content-primary flex items-center gap-3">
                <UsersIcon className="w-6 h-6 text-oracle-red" />
                <span>Employee Directory</span>
            </h2>
            <button 
                onClick={onClose} 
                className="p-1 text-content-secondary dark:text-dark-content-secondary hover:text-oracle-red dark:hover:text-oracle-red rounded-full focus:outline-none focus:ring-2 focus:ring-oracle-red/50"
                aria-label="Close employee directory"
            >
                <XIcon className="w-6 h-6" />
            </button>
            </div>
        </div>

        <div className="p-4 border-b border-border-primary dark:border-dark-border-primary flex-shrink-0 grid grid-cols-2 gap-2">
             <button 
                onClick={onAddEmployee}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-surface dark:bg-dark-surface border border-border-primary dark:border-dark-border-secondary text-content-secondary dark:text-dark-content-secondary hover:text-oracle-red hover:border-oracle-red/50 dark:hover:border-oracle-red/70 dark:hover:text-oracle-red rounded-md shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-oracle-red/50"
            >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="font-medium text-sm">Employee</span>
            </button>
            <button 
                onClick={onAddDepartment}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-surface dark:bg-dark-surface border border-border-primary dark:border-dark-border-secondary text-content-secondary dark:text-dark-content-secondary hover:text-oracle-red hover:border-oracle-red/50 dark:hover:border-oracle-red/70 dark:hover:text-oracle-red rounded-md shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-oracle-red/50"
            >
                <BriefcaseIcon className="w-5 h-5" />
                <span className="font-medium text-sm">Department</span>
            </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {departments.map(department => (
              <div key={department.name}>
                <div className="flex items-center justify-between group mb-3 pb-2 border-b border-border-primary dark:border-dark-border-secondary">
                    <h3 className="flex items-center gap-3 text-sm font-semibold text-content-secondary dark:text-dark-content-secondary tracking-wider uppercase">
                      {getDepartmentIcon(department.name)}
                      <span>{department.name}</span>
                    </h3>
                    <button 
                        onClick={() => onRemoveDepartment(department.name)}
                        title={`Remove ${department.name} department`}
                        className="p-1 text-content-secondary/50 dark:text-dark-content-secondary/50 hover:text-danger dark:hover:text-dark-danger opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                {department.members.length > 0 ? (
                    <ul className="space-y-3">
                    {department.members.map(member => (
                        <li key={member.id} className="text-sm flex justify-between items-center group/member">
                          <div>
                              <p className="font-medium text-content-primary dark:text-dark-content-primary">{member.name}</p>
                              <p className="text-xs text-content-secondary dark:text-dark-content-secondary">{member.role}</p>
                          </div>
                          <div className="flex items-center opacity-0 group-hover/member:opacity-100 transition-opacity duration-200">
                              <button 
                                  onClick={() => onEditEmployee(member, department.name)} 
                                  title={`Edit ${member.name}`}
                                  className="p-1 text-content-secondary/60 dark:text-dark-content-secondary/60 hover:text-oracle-red"
                              >
                                  <EditIcon className="w-4 h-4" />
                              </button>
                              <button 
                                  onClick={() => onRemoveEmployee(member.id)} 
                                  title={`Remove ${member.name}`}
                                  className="p-1 text-content-secondary/60 dark:text-dark-content-secondary/60 hover:text-danger dark:hover:text-dark-danger"
                              >
                                  <TrashIcon className="w-4 h-4" />
                              </button>
                          </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-xs text-center text-content-secondary/70 dark:text-dark-content-secondary/70 italic py-2">No members in this department.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};