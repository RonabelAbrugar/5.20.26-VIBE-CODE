/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatus, Assignee } from './types';

export const DEFAULT_ASSIGNEES: Assignee[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    initials: 'SC',
    color: 'bg-indigo-500 text-white',
  },
  {
    id: '2',
    name: 'Leo Zhang',
    email: 'leo@example.com',
    initials: 'LZ',
    color: 'bg-emerald-500 text-white',
  },
  {
    id: '3',
    name: 'Olivia Green',
    email: 'olivia@example.com',
    initials: 'OG',
    color: 'bg-pink-500 text-white',
  },
  {
    id: '4',
    name: 'David Miller',
    email: 'david@example.com',
    initials: 'DM',
    color: 'bg-amber-500 text-slate-900',
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Research user feedback for V2 pricing',
    description: 'Compile and analyze community comments from the beta feedback forms. Focus on spreadsheet migration pain-points.',
    status: TaskStatus.BACKLOG,
    priority: 'low',
    dueDate: '2026-06-15',
    assignee: DEFAULT_ASSIGNEES[2], // Olivia Green
    tags: ['Research', 'V2-Planning'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design high-fidelity mockup for Kanban columns',
    description: 'Draft typography pairings, color specifications, and interactive micro-animations for the new task board layout.',
    status: TaskStatus.TODO,
    priority: 'medium',
    dueDate: '2026-05-28',
    assignee: DEFAULT_ASSIGNEES[0], // Sarah Connor
    tags: ['Design', 'UI-Polish'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Integrate browser local storage persistence',
    description: 'Ensure all tasks are synchronized immediately to localStorage and recover gracefully on browser refresh triggers.',
    status: TaskStatus.IN_PROGRESS,
    priority: 'high',
    dueDate: '2026-05-22',
    assignee: DEFAULT_ASSIGNEES[1], // Leo Zhang
    tags: ['Core', 'Storage'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Implement native HTML5 drag-and-drop state indicators',
    description: 'Add column-level event listeners for dragover, drop, and dragleave to display responsive visual feedback while moving tasks.',
    status: TaskStatus.REVIEW,
    priority: 'high',
    dueDate: '2026-05-21',
    assignee: DEFAULT_ASSIGNEES[1], // Leo Zhang
    tags: ['Frontend', 'Dnd'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Fix mobile viewport column cutoff glitch',
    description: 'Ensure Kanban columns wrap correctly on tablet size and display an elegant horizontal scroll mechanism.',
    status: TaskStatus.DONE,
    priority: 'medium',
    dueDate: '2026-05-18',
    assignee: DEFAULT_ASSIGNEES[0], // Sarah Connor
    tags: ['Bug-Fix', 'Responsive'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Configure Docker environment parameters',
    description: 'Production container crashes on booting port due to environment mismatch issues. Needs manual port standardizing.',
    status: TaskStatus.BLOCKED,
    priority: 'critical',
    dueDate: '2016-05-20',
    assignee: DEFAULT_ASSIGNEES[3], // David Miller
    tags: ['DevOps', 'Blocking-Bug'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  }
];
