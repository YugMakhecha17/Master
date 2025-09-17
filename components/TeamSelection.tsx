import React from 'react';
import type { Department, DepartmentName } from '../types';
import { SoftwareIcon } from './icons/SoftwareIcon';
import { OperationsIcon } from './icons/OperationsIcon';
import { HRIcon } from './icons/HRIcon';
import { MarketingIcon } from './icons/MarketingIcon';
import { DesignIcon } from './icons/DesignIcon';
import { SalesIcon } from './icons/SalesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface TeamSelectionProps {
    departments: Department[];
    selectedDepartment: DepartmentName | 'All Teams';
    onSelectDepartment: (department: DepartmentName | 'All Teams') => void;
}

interface TeamCardProps {
  icon: React.ReactNode;
  label: string;
  isPrimary?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
}

const PRESET_ICONS: Record<string, React.ReactNode> = {
    Software: <SoftwareIcon className="w-12 h-12" />,
    Operations: <OperationsIcon className="w-12 h-12" />,
    HR: <HRIcon className="w-12 h-12" />,
    Marketing: <MarketingIcon className="w-12 h-12" />,
    Design: <DesignIcon className="w-12 h-12" />,
    Sales: <SalesIcon className="w-12 h-12" />,
};

const getDepartmentIcon = (departmentName: DepartmentName) => {
    return PRESET_ICONS[departmentName] || <SettingsIcon className="w-12 h-12" />;
};


const TeamCard: React.FC<TeamCardProps> = ({ icon, label, isPrimary = false, isHighlighted = false, onClick }) => {
  const baseClasses = "flex flex-col items-center text-center group transition-transform duration-300";
  const containerSize = isPrimary ? "w-32 h-32" : "w-28 h-28";
  const iconColor = isHighlighted ? "text-oracle-red" : "text-content-secondary dark:text-dark-content-secondary group-hover:text-oracle-red";
  const labelColor = isHighlighted ? "text-content-primary dark:text-dark-content-primary" : "text-content-secondary dark:text-dark-content-secondary group-hover:text-content-primary dark:group-hover:text-dark-content-primary";
  const borderClass = isHighlighted ? "border-oracle-red ring-2 ring-oracle-red/20" : "border-border-primary dark:border-dark-border-primary group-hover:border-oracle-red/50";
  const containerClasses = `
    ${containerSize}
    bg-surface dark:bg-dark-surface rounded-lg shadow-sm flex items-center justify-center cursor-pointer 
    transition-all duration-300 border 
    ${borderClass}
    ${isPrimary ? 'shadow-md' : ''}
  `;

  return (
    <button onClick={onClick} className={baseClasses}>
      <div className={containerClasses}>
        <div className={`${iconColor} transition-colors duration-300`}>{icon}</div>
      </div>
      <p className={`mt-3 font-semibold uppercase tracking-wider transition-colors duration-300 ${labelColor} ${isPrimary ? 'text-lg' : 'text-base'}`}>
        {label}
      </p>
    </button>
  );
};

export const TeamSelection: React.FC<TeamSelectionProps> = ({ departments, selectedDepartment, onSelectDepartment }) => {
  return (
    <section className="bg-gray-50 dark:bg-dark-surface/50 py-12 border-b-2 border-border-primary dark:border-dark-border-primary relative">
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center gap-10">
                <TeamCard 
                    label="All Teams" 
                    icon={<UsersIcon className="w-16 h-16" />} 
                    isPrimary={true}
                    isHighlighted={selectedDepartment === 'All Teams'}
                    onClick={() => onSelectDepartment('All Teams')}
                />
                <div className="flex flex-wrap justify-center items-start gap-x-4 gap-y-8 md:gap-x-6 lg:gap-x-8">
                   {departments.map(dept => (
                        <TeamCard 
                            key={dept.name} 
                            label={dept.name} 
                            icon={getDepartmentIcon(dept.name)} 
                            isHighlighted={selectedDepartment === dept.name}
                            onClick={() => onSelectDepartment(dept.name)}
                        />
                   ))}
                </div>
            </div>
        </div>
    </section>
  );
};