/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { FeedbackMessage } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface FeedbackToastProps {
  messages: FeedbackMessage[];
  onDismiss: (id: string) => void;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ messages, onDismiss }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {messages.map((msg) => {
        // Automatic dismiss timer trigger
        return <ToastItem key={msg.id} message={msg} onDismiss={onDismiss} />;
      })}
    </div>
  );
};

// Internal single toast item to isolate timers cleanly
const ToastItem: React.FC<{ message: FeedbackMessage; onDismiss: (id: string) => void }> = ({
  message,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const getToastStyles = (type: 'success' | 'info' | 'error') => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-emerald-50 dark:bg-[#11241a]/95 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'error':
        return {
          wrapper: 'bg-red-50 dark:bg-[#2c1318]/95 border-red-200 dark:border-rose-900/50 text-red-800 dark:text-rose-300',
          icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-450" />,
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-indigo-50 dark:bg-slate-800 border-indigo-200 dark:border-slate-700/80 text-indigo-800 dark:text-slate-200',
          icon: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
        };
    }
  };

  const styles = getToastStyles(message.type);

  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border shadow-md animate-in slide-in-from-bottom-5 fade-in duration-200 ${styles.wrapper}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="shrink-0">{styles.icon}</div>
        <p className="text-xs font-semibold leading-normal">{message.text}</p>
      </div>
      <button
        onClick={() => onDismiss(message.id)}
        className="p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-150/50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
        type="button"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
