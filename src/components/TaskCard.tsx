/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task, PriorityLevel } from '../types';
import { Calendar, Trash2, Edit3, AlertCircle, Tag, CheckCircle2, Copy } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragEnd,
}) => {
  const getPriorityStyles = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'high':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'medium':
        return 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/50';
      case 'low':
      default:
        return 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const isOverdue = (dueDateStr?: string) => {
    if (!dueDateStr || task.status === 'DONE') return false;
    const dueDate = new Date(dueDateStr + 'T23:59:59');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  const getBorderLeftClass = () => {
    if (task.status === 'DONE') return 'border-l-4 border-l-slate-300';
    switch (task.priority) {
      case 'critical':
        return 'border-l-4 border-l-rose-500';
      case 'high':
        return 'border-l-4 border-l-amber-500';
      case 'medium':
        return 'border-l-4 border-l-indigo-600';
      case 'low':
      default:
        return 'border-l-4 border-l-emerald-500';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id);
  };

  return (
    <div
      id={`task-card-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`group relative bg-white dark:bg-slate-800/90 border border-gray-200/70 dark:border-slate-700/80 rounded-xl p-4 ${getBorderLeftClass()} ${
        task.status === 'DONE' ? 'opacity-70 saturate-75' : ''
      } [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5`}
    >
      {/* Priority Badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize leading-tight ${getPriorityStyles(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        
        {/* Quick Actions (only visible on container hover for a clean visual look) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onDuplicate(task)}
            className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            title="Duplicate Task"
            type="button"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            title="Edit Task"
            type="button"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            title="Delete Task"
            type="button"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags section */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3.5">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
            >
              <Tag className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold align-middle px-1">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer / Meta Data */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-2.5 mt-2">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5">
          {task.status === 'DONE' ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              Done
            </span>
          ) : task.dueDate ? (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                isOverdue(task.dueDate)
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 animate-pulse'
                  : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80'
              }`}
              title={isOverdue(task.dueDate) ? 'Overdue' : 'Due date'}
            >
              {isOverdue(task.dueDate) ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 tracking-wide font-light">No due date</span>
          )}
        </div>

        {/* Assignee Circle */}
        {task.assignee && (
          <div
            className="flex items-center justify-center"
            title={`Assigned to ${task.assignee.name}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800/90 shadow-xs ${task.assignee.color}`}
            >
              {task.assignee.initials}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
