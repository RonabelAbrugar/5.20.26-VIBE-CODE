/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, AlertTriangle, Layers, Zap, Clock } from 'lucide-react';

interface BoardStatsProps {
  tasks: Task[];
}

export const BoardStats: React.FC<BoardStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  
  // Compute lists
  const backlogCount = tasks.filter((t) => t.status === TaskStatus.BACKLOG).length;
  const todoCount = tasks.filter((t) => t.status === TaskStatus.TODO).length;
  const inProgressCount = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
  const reviewCount = tasks.filter((t) => t.status === TaskStatus.REVIEW).length;
  const blockedCount = tasks.filter((t) => t.status === TaskStatus.BLOCKED).length;
  const doneCount = tasks.filter((t) => t.status === TaskStatus.DONE).length;

  const criticalCount = tasks.filter((t) => t.priority === 'critical' && t.status !== TaskStatus.DONE).length;
  
  let completionPercentage = 0;
  if (total > 0) {
    completionPercentage = Math.round((doneCount / total) * 100);
  }

  // Calculate dynamic average time in progress or average tags if needed, but keeping it direct and polished is key.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 transition-colors">
      
      {/* Metric 1 - Total Workload */}
      <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-4 [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Active Sprint Load</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{total}</h3>
          <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Core tasks currently active</p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-905 p-2 rounded-xl border border-gray-150 dark:border-slate-700">
          <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400" />
        </div>
      </div>

      {/* Metric 2 - Progress rate with an incremental color slider bar */}
      <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-4 [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[90px]">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Completion Index</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">{completionPercentage}%</h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        {/* Sleek Progress gauge */}
        <div className="w-full mt-2.5">
          <div className="h-1 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
               className="h-full bg-emerald-500 rounded-full transition-all duration-500"
               style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-gray-400 dark:text-slate-500 mt-1 font-bold">
            <span>{doneCount} TASKS DONE</span>
            <span>{total - doneCount} REMAINING</span>
          </div>
        </div>
      </div>

      {/* Metric 3 - Urgent Backlog Alerts */}
      <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-4 [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Urgent Bottlenecks</span>
          <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
            {criticalCount}
          </h3>
          <p className="text-[10px] text-rose-500/80 dark:text-rose-400/80 font-bold">
            {criticalCount > 0 ? 'Requires attention' : 'No urgent alerts listed'}
          </p>
        </div>
        <div className={`p-2 rounded-xl border ${criticalCount > 0 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 animate-pulse' : 'bg-gray-50 dark:bg-slate-905 border-gray-150 dark:border-slate-700'}`}>
          <Zap className={`w-4 h-4 ${criticalCount > 0 ? 'text-rose-500' : 'text-gray-400 dark:text-slate-500'}`} />
        </div>
      </div>

      {/* Metric 4 - Blockage Risk Index */}
      <div className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-4 [box-shadow:0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Blocked & Halted</span>
          <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
            {blockedCount}
          </h3>
          <p className="text-[10px] text-amber-500/80 dark:text-amber-400/80 font-bold">
            {blockedCount > 0 ? 'Escalation required' : 'No current blockages'}
          </p>
        </div>
        <div className={`p-2 rounded-xl border ${blockedCount > 0 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40' : 'bg-gray-50 dark:bg-slate-905 border-gray-150 dark:border-slate-700'}`}>
          <AlertTriangle className={`w-4 h-4 ${blockedCount > 0 ? 'text-amber-500' : 'text-gray-400 dark:text-slate-500'}`} />
        </div>
      </div>

    </div>
  );
};
