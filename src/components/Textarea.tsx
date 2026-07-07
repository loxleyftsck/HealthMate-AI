import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all duration-200 outline-none resize-none
            bg-gray-50/50 border-gray-200 text-gray-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
            dark:bg-slate-900/50 dark:border-slate-800 dark:text-gray-100 dark:focus:bg-slate-900 dark:focus:border-emerald-500 dark:focus:ring-2 dark:focus:ring-emerald-500/20
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-rose-500 ml-1 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
