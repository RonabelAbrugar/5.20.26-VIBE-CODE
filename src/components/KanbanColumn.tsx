/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Task, TaskStatus, BoardColumn } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, DownloadCloud, AlertCircle } from 'lucide-react';

interface KanbanColumnProps {
  column: BoardColumn;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (task: Task) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
  onAddTaskInColumn: (status: TaskStatus) => void;
  activeDragId: string | null;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onDragStart,
  onDragEnd,
  onDropTask,
  onAddTaskInColumn,
  activeDragId,
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    // Retrieve transferred taskId
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, column.id);
    }
  };

  return (
    <div
      id={`kanban-column-${column.id}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] bg-gray-50/80 dark:bg-slate-900/40 border border-gray-200/70 dark:border-slate-800/80 rounded-2xl p-4 transition-all duration-200 select-none ${
        isOver
          ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs'
          : activeDragId
          ? 'border-gray-350 dark:border-slate-700 bg-gray-50/40 dark:bg-slate-800/20 border-dashed'
          : 'border-gray-200/60 dark:border-slate-800/50 bg-gray-50/60 dark:bg-slate-900/10'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200/50 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Vertical Color Indicator Pill */}
          <span className={`w-1.5 h-4.5 rounded-full ${column.color}`} />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 tracking-tight capitalize">
            {column.title}
          </h3>
          {/* Badge Count */}
          <span
            className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${column.badgeColor} dark:opacity-90`}
          >
            {tasks.length}
          </span>
        </div>

        {/* Dynamic add button for this column */}
        <button
          onClick={() => onAddTaskInColumn(column.id)}
          className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={`Add task under ${column.title}`}
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] custom-scrollbar pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDuplicate={onDuplicateTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl bg-white/40 dark:bg-slate-800/5 text-slate-400 dark:text-slate-500 h-full min-h-[140px] transition-all">
            {isOver ? (
              <span className="flex flex-col items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400 font-bold">
                <DownloadCloud className="w-5 h-5 truncate animate-bounce" />
                Drop task here!
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-405 dark:text-slate-500 tracking-wide text-center px-4">
                No active tasks.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
