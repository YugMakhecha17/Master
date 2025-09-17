import React, { useState, useRef, useEffect } from 'react';
import { type Employee } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ViewSwitcherProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  engineers: Employee[];
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setCurrentView, engineers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const handleSelect = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const getAssigneeName = (id: string) => {
    if (id === 'Scrum Master') return 'Scrum Master';
    return engineers.find(e => e.id === id)?.name || 'Unknown View';
  }

  return (
    <div ref={wrapperRef} className="relative inline-block text-left w-full md:w-auto">
      <div>
        <button
          type="button"
          className="inline-flex w-full md:w-72 justify-between items-center gap-x-1.5 rounded-md bg-surface px-4 py-2 text-sm font-medium text-content-primary shadow-sm ring-1 ring-inset ring-border-primary hover:bg-background"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-content-secondary" />
            <span className="text-content-secondary mr-1">Viewing as:</span>
            <span className="font-semibold">{getAssigneeName(currentView)}</span>
          </span>
          <svg className="-mr-1 h-5 w-5 text-content-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 z-10 mt-2 w-full md:w-72 origin-top-right rounded-md bg-surface shadow-lg ring-1 ring-border-primary focus:outline-none max-h-80 overflow-y-auto"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
             <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleSelect('Scrum Master'); }}
              className={`flex justify-between items-center px-4 py-2 text-sm ${currentView === 'Scrum Master' ? 'font-semibold text-oracle-red' : 'text-content-primary'} hover:bg-background`}
              role="menuitem"
            >
              Scrum Master
              {currentView === 'Scrum Master' && <CheckIcon className="w-5 h-5 text-oracle-red" />}
            </a>
            {engineers.map(engineer => (
              <a
                href="#"
                key={engineer.id}
                onClick={(e) => { e.preventDefault(); handleSelect(engineer.id); }}
                className={`flex justify-between items-center px-4 py-2 text-sm ${currentView === engineer.id ? 'font-semibold text-oracle-red' : 'text-content-primary'} hover:bg-background`}
                role="menuitem"
              >
                {engineer.name}
                {currentView === engineer.id && <CheckIcon className="w-5 h-5 text-oracle-red" />}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};