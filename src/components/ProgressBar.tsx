import React from 'react';

interface ProgressBarProps {
  percentage: number;
  title?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, title = "Progress" }) => {
  const roundedPercentage = Math.round(percentage);

  return (
    <div className="w-full">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-content-primary dark:text-dark-content-primary">{title}</span>
            <span className="text-sm font-medium text-content-primary dark:text-dark-content-primary">{roundedPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-dark-border-primary rounded-full h-2.5">
            <div
                className="bg-oracle-red h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${roundedPercentage}%` }}
                role="progressbar"
                aria-valuenow={roundedPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
            ></div>
        </div>
    </div>
  );
};