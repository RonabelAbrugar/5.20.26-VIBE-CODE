/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, PriorityLevel, Assignee } from '../types';
import { X, Calendar, User, Tag, HelpCircle, Save } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  task?: Task; // If provided, we are editing. Otherwise, creating.
  initialStatus?: TaskStatus;
  assigneesList: Assignee[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  initialStatus = TaskStatus.TODO,
  assigneesList,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('unassigned');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errorCheck, setErrorCheck] = useState('');

  // Clear or load default task data on show/change
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setAssigneeId(task.assignee?.id || 'unassigned');
      setTagsInput(task.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('medium');
      setDueDate('');
      setAssigneeId('unassigned');
      setTagsInput('');
    }
    setCustomName('');
    setCustomEmail('');
    setErrorCheck('');
  }, [task, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorCheck('Task title is required.');
      return;
    }

    if (title.trim().length > 100) {
      setErrorCheck('Task title must be under 100 characters.');
      return;
    }

    // Process tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    let selectedAssignee = assigneesList.find((a) => a.id === assigneeId);

    if (assigneeId === 'custom') {
      if (!customName.trim()) {
        setErrorCheck('Please enter the custom assignee full name.');
        return;
      }
      
      const RANDOM_COLORS = [
        'bg-emerald-500 text-white',
        'bg-indigo-500 text-white',
        'bg-pink-500 text-white',
        'bg-amber-500 text-slate-900',
        'bg-sky-500 text-white',
        'bg-purple-500 text-white',
        'bg-rose-500 text-white',
        'bg-teal-500 text-white',
      ];
      const randomColor = RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];

      const generateInitials = (n: string): string => {
        const parts = n.trim().split(/\s+/);
        if (parts.length === 0) return '??';
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return ((parts[0][0] || '') + (parts[1]?.[0] || '')).toUpperCase().slice(0, 2);
      };

      selectedAssignee = {
        id: `assignee-${Math.random().toString(36).substring(2, 9)}`,
        name: customName.trim(),
        email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        initials: generateInitials(customName),
        color: randomColor,
      };
    }

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined,
      assignee: selectedAssignee || undefined,
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal element container */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700/80 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/60">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {task ? 'Edit Workspace Task' : 'Create New Collaboration Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorCheck && (
            <div className="p-3 bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-100 dark:border-red-900/45">
              {errorCheck}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Integrate custom API endpoints"
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
              maxLength={100}
              required
            />
          </div>

          {/* Description field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short description of the objective, dependencies, or links to references..."
              className="w-full h-24 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workflow Column</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value={TaskStatus.BACKLOG}>Backlog</option>
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.REVIEW}>Review</option>
                <option value={TaskStatus.BLOCKED}>Blocked</option>
                <option value={TaskStatus.DONE}>Done</option>
              </select>
            </div>

            {/* Priority select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Assign Employee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
              >
                <option value="unassigned">Unassigned</option>
                {assigneesList.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} ({assignee.initials})
                  </option>
                ))}
                <option value="custom" className="text-indigo-600 dark:text-indigo-400 font-semibold">+ Enter Custom Assignee...</option>
              </select>
            </div>

            {/* Due Date selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Custom Assignee extra fields */}
          {assigneeId === 'custom' && (
            <div className="p-4 bg-gray-50/70 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-700/80 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">New Collaborator Details</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-800 dark:text-slate-100 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g., john@example.com"
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags entry */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., UI, Security, V2 (separated by commas)"
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Split multiple tags with commas.</p>
          </div>

          {/* Actions at the bottom */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-6 bg-slate-50/50 dark:bg-slate-900/60 -mx-6 -mb-6 px-6 py-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg bg-transparent border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
