/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Assignee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  color: string; // Tailwind bg color class, e.g. 'bg-emerald-500' or 'bg-amber-500'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate?: string; // YYYY-MM-DD format
  assignee?: Assignee;
  tags: string[];
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  color: string; // Card indicator border color
  bgClass: string; // Column header background highlight
  badgeColor: string; // Badge label classes
}

export interface FeedbackMessage {
  type: 'success' | 'info' | 'error';
  text: string;
  id: string;
}
