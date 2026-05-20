/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PriorityLevel, Assignee } from '../types';
import { Search, Plus, Filter, RotateCcw, FileDown, FileUp, X } from 'lucide-react';

interface BoardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAssigneeId: string;
  setSelectedAssigneeId: (id: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  assigneesList: Assignee[];
  onClearFilters: () => void;
  onAddTask: () => void;
  onResetDemo: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  totalCount: number;
  filteredCount: number;
}

export const BoardFilters: React.FC<BoardFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedAssigneeId,
  setSelectedAssigneeId,
  selectedPriority,
  setSelectedPriority,
  assigneesList,
  onClearFilters,
  onAddTask,
  onResetDemo,
  onExport,
  onImport,
  totalCount,
  filteredCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = searchQuery !== '' || selectedAssigneeId !== 'all' || selectedPriority !== 'all';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
      // Reset input value to allow uploading the same file multiple times
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-5 mb-6 [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col gap-4 transition-colors">
      {/* Top action row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Statistics count snippet */}
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            Kanban Collaboration Workspace
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {hasActiveFilters ? (
              <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-md font-medium">
                Showing {filteredCount} of {totalCount} active tasks matching active filters
              </span>
            ) : (
              <span className="font-medium text-gray-400 dark:text-slate-500">Current sprint contains {totalCount} active tasks across 6 columns.</span>
            )}
          </p>
        </div>

        {/* Workspace global quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* File Backup Actions */}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
            title="Download Workspace JSON Backup"
            type="button"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export Backup
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
            title="Upload Workspace JSON Backup File"
            type="button"
          >
            <FileUp className="w-3.5 h-3.5" />
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset Demo Data button */}
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
            title="Reset storage to default high quality team data"
            type="button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo
          </button>

          {/* Add Task CTA */}
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-xs font-bold text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
            type="button"
          >
            <Plus className="w-4 h-4" />
            AddTask
          </button>
        </div>
      </div>

      {/* Filter and selector row */}
      <div className="flex flex-col md:flex-row items-center gap-3 pt-3 border-t border-gray-150 dark:border-slate-700/60">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task title, description, or tags..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50/70 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500/30 transition-all text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Filter label indicator (icon) */}
        <div className="hidden md:flex items-center gap-1.5 text-gray-400 dark:text-slate-500 pl-1 pr-2 border-r border-gray-200 dark:border-slate-700 h-5">
          <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Filters</span>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* Assignee filter selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 shrink-0 select-none">Assignee:</span>
            <select
              value={selectedAssigneeId}
              onChange={(e) => setSelectedAssigneeId(e.target.value)}
              className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-40 cursor-pointer"
            >
              <option value="all">All Collaborators</option>
              <option value="unassigned">Unassigned</option>
              {assigneesList.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 shrink-0 select-none">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-36 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Active Filter Clear indicator Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/70 rounded-md px-2.5 py-1 border border-indigo-100 transition-all shrink-0 cursor-pointer w-full sm:w-auto justify-center"
              type="button"
            >
              <X className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
