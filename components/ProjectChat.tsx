import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';

interface ProjectChatProps {
  history: ChatMessage[];
  isChatting: boolean;
  onSendMessage: (message: string) => void;
}

export const ProjectChat: React.FC<ProjectChatProps> = ({ history, isChatting, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat history when a new message is added
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history, isChatting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isChatting) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-oracle-red/10 flex items-center justify-center border border-oracle-red/20">
            <BrainCircuitIcon className="w-5 h-5 text-oracle-red" />
          </div>
        )}
        <div 
          className={`max-w-xl p-3 rounded-lg text-sm ${isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-100 text-content-primary rounded-bl-none border border-border-primary'}`
          }
        >
          {/* A simple markdown renderer for bold text and lists */}
          {message.text.split('\n').map((line, i) => {
             if (line.match(/^\s*(\*|-)\s/)) { // List item
                return <p key={i} className="ml-4 relative before:content-['•'] before:absolute before:-left-4">{line.replace(/^\s*(\*|-)\s/, '')}</p>;
            }
            const parts = line.split(/(\*\*.*?\*\*)/g); // Bold text
            return <p key={i}>{parts.map((part, j) => part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}</p>;
          })}
        </div>
        {isUser && (
           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-medium mb-4 text-content-primary flex items-center gap-3">
        <span className="text-oracle-red font-semibold">2a.</span>
        <span className="uppercase tracking-wider">Refine with AI</span>
      </h2>
      <div className="bg-surface border border-border-primary rounded-md shadow-sm flex flex-col h-[500px]">
        <div ref={chatHistoryRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
          {history.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isChatting && (
            <div className="flex items-start gap-4">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-oracle-red/10 flex items-center justify-center border border-oracle-red/20">
                 <BrainCircuitIcon className="w-5 h-5 text-oracle-red" />
               </div>
               <div className="max-w-xl p-3 rounded-lg bg-gray-100 border border-border-primary rounded-bl-none">
                 <div className="flex items-center gap-2 text-sm text-content-secondary">
                    <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-oracle-red rounded-full animate-pulse delay-150"></div>
                    <span>Thinking...</span>
                 </div>
               </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-background border-t border-border-primary">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={isChatting}
              className="w-full p-2 bg-surface border border-gray-300 rounded-md shadow-inner focus:ring-2 focus:ring-oracle-red/50 focus:border-oracle-red transition duration-300 text-content-primary placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={isChatting || !message.trim()}
              className="p-2.5 bg-oracle-red text-white rounded-md shadow-md hover:bg-oracle-red-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};