/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Task, TaskStatus, BoardColumn, FeedbackMessage } from './types';
import { INITIAL_TASKS, DEFAULT_ASSIGNEES } from './mockData';
import { KanbanColumn } from './components/KanbanColumn';
import { BoardFilters } from './components/BoardFilters';
import { BoardStats } from './components/BoardStats';
import { TaskModal } from './components/TaskModal';
import { FeedbackToast } from './components/FeedbackToast';
import { Trello, Sparkles, Sun, Moon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'kanban_board_tasks_v1';

const COLUMNS: BoardColumn[] = [
  {
    id: TaskStatus.BACKLOG,
    title: 'Backlog',
    color: 'bg-zinc-400',
    bgClass: 'bg-zinc-50',
    badgeColor: 'bg-zinc-100 text-zinc-700',
  },
  {
    id: TaskStatus.TODO,
    title: 'To Do',
    color: 'bg-indigo-400',
    bgClass: 'bg-indigo-50/50',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: 'In Progress',
    color: 'bg-sky-400',
    bgClass: 'bg-sky-50/50',
    badgeColor: 'bg-sky-100 text-sky-700',
  },
  {
    id: TaskStatus.REVIEW,
    title: 'Review',
    color: 'bg-purple-400',
    bgClass: 'bg-purple-50/50',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: TaskStatus.BLOCKED,
    title: 'Blocked',
    color: 'bg-rose-500',
    bgClass: 'bg-rose-50/50',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: TaskStatus.DONE,
    title: 'Done',
    color: 'bg-emerald-400',
    bgClass: 'bg-emerald-50/50',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kanban_dark_mode') === 'true';
    } catch {
      return false;
    }
  });
  
  // Drag and drop state tracking
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Custom confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText?: string;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Feedback notifications
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);

  // 1. Initial State Load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(INITIAL_TASKS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      }
    } catch (e) {
      console.error('Failed to parse local storage tasks, starting fresh.', e);
      setTasks(INITIAL_TASKS);
    }
  }, []);

  // Dark Mode side effect
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('kanban_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('kanban_dark_mode', 'false');
      }
    } catch (e) {
      console.error('Failed to write dark mode preference.', e);
    }
  }, [darkMode]);

  // 2. State Sync Trigger
  const saveToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  // Toast adder helper
  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newMsg: FeedbackMessage = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type,
    };
    setFeedbackMessages((prev) => [...prev, newMsg]);
  };

  const handleDismissToast = (id: string) => {
    setFeedbackMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Helper request confirmation trigger
  const requestConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    isDanger = true
  ) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
      confirmText,
      isDanger,
    });
  };

  // 3. CRUD Operations
  const handleAddTask = () => {
    setSelectedTask(undefined);
    setModalInitialStatus(TaskStatus.TODO);
    setIsModalOpen(true);
  };

  const handleAddTaskInColumn = (status: TaskStatus) => {
    setSelectedTask(undefined);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalInitialStatus(task.status);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    requestConfirm(
      'Delete Task',
      `Are you sure you want to delete task "${target.title}"? This task will be permanently removed from your workspace board.`,
      () => {
        const filtered = tasks.filter((t) => t.id !== id);
        saveToStorage(filtered);
        addToast(`Task "${target.title}" deleted successfully.`, 'error');
      },
      'Delete Task',
      true
    );
  };

  const handleDuplicateTask = (taskToDuplicate: Task) => {
    const now = new Date().toISOString();
    const duplicatedTask: Task = {
      ...taskToDuplicate,
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
      title: `${taskToDuplicate.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    saveToStorage([duplicatedTask, ...tasks]);
    addToast(`Duplicated task "${taskToDuplicate.title}" successfully.`, 'success');
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();

    if (taskData.id) {
      // Edit mode
      const updated = tasks.map((existingTask) => {
        if (existingTask.id === taskData.id) {
          return {
            ...existingTask,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            assignee: taskData.assignee,
            tags: taskData.tags,
            updatedAt: now,
          };
        }
        return existingTask;
      });
      saveToStorage(updated);
      addToast(`Task "${taskData.title}" updated successfully.`, 'success');
    } else {
      // Create mode
      const newTask: Task = {
        ...taskData,
        id: `task-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      saveToStorage([newTask, ...tasks]);
      addToast(`New task "${taskData.title}" created successfully.`, 'success');
    }
  };

  // 4. Drag & Drop Drops Trigger
  const handleDragStart = (id: string) => {
    setActiveDragId(id);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };

  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    // Check if status actually changed
    if (targetTask.status === targetStatus) return;

    const oldStatus = targetTask.status;

    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    saveToStorage(updated);
    addToast(
      `Moved "${targetTask.title}" from ${oldStatus.toLowerCase().replace('_', ' ')} to ${targetStatus
        .toLowerCase()
        .replace('_', ' ')}.`,
      'info'
    );
  };

  // 5. Extra Operations (Backup, Import, Demo Reset)
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedAssigneeId('all');
    setSelectedPriority('all');
    addToast('Filters successfully cleared.', 'info');
  };

  const handleResetDemoData = () => {
    requestConfirm(
      'Reset Sprint Workspace',
      'Are you sure you want to restore all columns to the default team demo data? All custom-created tasks will be permanently wiped.',
      () => {
        saveToStorage(INITIAL_TASKS);
        addToast('Workspace restored to initial sprint demo data.', 'success');
      },
      'Reset Workspace Data',
      true
    );
  };

  const handleExportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'kanban_workspace_backup.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Workspace configuration exported successfully.', 'success');
    } catch {
      addToast('Failed to export backup.', 'error');
    }
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (Array.isArray(parsed)) {
          // Rudimentary JSON structure check
          const isValidKeys = parsed.every((item) => item.id && item.title && item.status);
          if (isValidKeys) {
            saveToStorage(parsed);
            addToast(`Successfully imported ${parsed.length} tasks!`, 'success');
          } else {
            addToast('Import failed. Invalid standard schema found inside workspace backup.', 'error');
          }
        } else {
          addToast('Import failed. Uploaded document is not a JSON array.', 'error');
        }
      } catch {
        addToast('Failed to parse uploaded backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // 6. Reactive Filters
  // Dynamically aggregate all available assignees (both static default ones and any custom-created ones stored inside tasks)
  const allAssignees = [...DEFAULT_ASSIGNEES];
  tasks.forEach((task) => {
    if (task.assignee && !allAssignees.some((a) => a.id === task.assignee?.id)) {
      allAssignees.push(task.assignee);
    }
  });

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      searchLower === '' ||
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesAssignee =
      selectedAssigneeId === 'all' ||
      (selectedAssigneeId === 'unassigned' && !task.assignee) ||
      (task.assignee && task.assignee.id === selectedAssigneeId);

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;

    return matchesSearch && matchesAssignee && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white pb-10 transition-colors duration-200">
      {/* Minimalism Header */}
      <header className="h-16 border-b border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 flex items-center justify-between px-6 md:px-8 shrink-0 mb-6 transition-colors duration-200">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-xs">
              <Trello className="w-4 h-4" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
              SyncBoard <span className="text-indigo-600 dark:text-indigo-400">v1.1</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-medium text-gray-400 dark:text-slate-500">
            <span className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-405 h-16 flex items-center cursor-default">
              Sprint Workspace
            </span>
            <span className="h-16 flex items-center cursor-default hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
              Alpha Board
            </span>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Dark Mode toggle button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-755 dark:text-slate-400 dark:hover:text-slate-200 shadow-xs hover:shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center bg-transparent"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            type="button"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-slate-505 font-medium bg-gray-55/70 dark:bg-slate-905/40 border border-gray-200 dark:border-slate-800 rounded-full py-1 px-3 select-none">
            <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400 animate-pulse" />
            <span>Clean Minimalism Active</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">

        {/* Dashboard Metrics */}
        <BoardStats tasks={tasks} />

        {/* Filters and Utilities Bar */}
        <BoardFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedAssigneeId={selectedAssigneeId}
          setSelectedAssigneeId={setSelectedAssigneeId}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          assigneesList={allAssignees}
          onClearFilters={handleClearFilters}
          onAddTask={handleAddTask}
          onResetDemo={handleResetDemoData}
          onExport={handleExportData}
          onImport={handleImportData}
          totalCount={tasks.length}
          filteredCount={filteredTasks.length}
        />

        {/* Kanban Board columns section */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800/80 scrollbar-track-transparent">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={columnTasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onDuplicateTask={handleDuplicateTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDropTask={handleDropTask}
                onAddTaskInColumn={handleAddTaskInColumn}
                activeDragId={activeDragId}
              />
            );
          })}
        </div>

      </div>

      {/* Popups & Elements of Communication */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        initialStatus={modalInitialStatus}
        assigneesList={allAssignees}
      />

      <FeedbackToast messages={feedbackMessages} onDismiss={handleDismissToast} />

      {/* Custom Confirmation Modal */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-700/80 p-6 animate-in fade-in zoom-in-95 duration-150 transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {confirmConfig.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {confirmConfig.description}
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-805 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer bg-white dark:bg-transparent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmConfig.onConfirm}
                className={`px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-all cursor-pointer shadow-xs hover:shadow-md ${
                  confirmConfig.isDanger
                    ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                }`}
              >
                {confirmConfig.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
