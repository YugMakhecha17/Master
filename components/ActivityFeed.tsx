import React from 'react';
import type { Ticket, Comment } from '../types';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

interface ActivityFeedProps {
  tickets: Ticket[];
}

interface ActivityItem extends Comment {
  ticketTitle: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ tickets }) => {
  const allActivities: ActivityItem[] = tickets
    .flatMap(ticket =>
      ticket.comments.map(comment => ({
        ...comment,
        ticketTitle: ticket.title,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (allActivities.length === 0) {
    return (
      <div className="bg-surface p-4 rounded-md border border-border-primary h-full flex items-center justify-center">
        <p className="text-sm text-content-secondary/70">No ticket activity yet. Updates will appear here.</p>
      </div>
    );
  }

  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="bg-surface p-4 rounded-md border border-border-primary max-h-96 overflow-y-auto">
      <h3 className="text-lg font-medium text-content-primary mb-3">Activity Feed</h3>
      <ul className="space-y-4">
        {allActivities.map((activity, index) => (
          <li key={`${activity.timestamp}-${index}`} className="flex gap-3">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center ring-1 ring-border-primary">
                    <MessageSquareIcon className="w-4 h-4 text-content-secondary" />
                </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-content-primary">
                <span className="font-semibold text-oracle-red">{activity.author}</span> moved ticket "{activity.ticketTitle}" from{' '}
                <span className="font-medium">{activity.fromStatus}</span> to{' '}
                <span className="font-medium">{activity.toStatus}</span>.
              </p>
              <p className="text-xs text-content-secondary/80 mt-1 italic bg-background p-2 rounded-md border border-border-primary">
                "{activity.text}"
              </p>
              <p className="text-xs text-content-secondary/70 mt-1.5">{timeSince(activity.timestamp)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
