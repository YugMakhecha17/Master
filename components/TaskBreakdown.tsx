import React from 'react';
import type { SuggestedTask } from '../types';
import { TaskCard } from './TaskCard';

interface TaskBreakdownProps {
  tasks: SuggestedTask[];
  onAddToBacklog: (task: SuggestedTask) => void;
}

export const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ tasks, onAddToBacklog }) => {
  return (
    <section className="mt-12">
       <h2 className="text-xl font-medium mb-4 text-content-primary flex items-center gap-3">
        <span className="text-oracle-red font-semibold">2.</span>
        <span className="uppercase tracking-wider">Review &amp; Add to Backlog</span>
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onAddToBacklog={onAddToBacklog} />
        ))}
      </div>
    </section>
  );
};
