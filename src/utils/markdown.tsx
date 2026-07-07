import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const renderMarkdown = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let listKey = 0;
  
  let isInsideQuote = false;
  let quoteType: 'note' | 'warning' | 'important' | 'info' = 'info';
  let quoteLines: string[] = [];
  
  let isInsideTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}-${listKey++}`} className="list-disc pl-5 my-3 space-y-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const flushQuote = () => {
    if (isInsideQuote && quoteLines.length > 0) {
      const quoteText = quoteLines.join('\n');
      let icon = <Info className="w-5 h-5 text-emerald-500 shrink-0" />;
      let title = 'Note';
      let borderClass = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 dark:border-emerald-500/40';
      let titleClass = 'text-emerald-800 dark:text-emerald-400';

      if (quoteType === 'warning') {
        icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
        title = 'Warning';
        borderClass = 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-500/40';
        titleClass = 'text-amber-800 dark:text-amber-400';
      } else if (quoteType === 'important') {
        icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
        title = 'Important';
        borderClass = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/10 dark:border-rose-500/40';
        titleClass = 'text-rose-800 dark:text-rose-400';
      }

      elements.push(
        <div key={`quote-${elements.length}`} className={`flex gap-3 p-4 my-4 border-l-4 rounded-r-2xl ${borderClass}`}>
          {icon}
          <div className="flex flex-col gap-1 text-sm leading-relaxed">
            <span className={`font-bold font-display text-xs uppercase tracking-wider ${titleClass}`}>{title}</span>
            <div className="text-gray-700 dark:text-gray-300">{parseInlineStyles(quoteText)}</div>
          </div>
        </div>
      );
      
      quoteLines = [];
      isInsideQuote = false;
    }
  };

  const flushTable = () => {
    if (isInsideTable && (tableHeaders.length > 0 || tableRows.length > 0)) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-4 border border-gray-100 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left border-collapse text-sm">
            {tableHeaders.length > 0 && (
              <thead>
                <tr className="bg-gray-50/80 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-800">
                  {tableHeaders.map((header, idx) => (
                    <th key={`th-${idx}`} className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {parseInlineStyles(header)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, rowIdx) => (
                <tr 
                  key={`tr-${rowIdx}`} 
                  className="border-b border-gray-50 dark:border-slate-800/40 last:border-0 hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors"
                >
                  {row.map((cell, cellIdx) => (
                    <td key={`td-${rowIdx}-${cellIdx}`} className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {parseInlineStyles(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
      tableHeaders = [];
      tableRows = [];
      isInsideTable = false;
    }
  };

  const parseInlineStyles = (lineText: string): React.ReactNode => {
    if (!lineText) return '';
    
    // Split by bold (**bold**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(lineText)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(lineText.substring(lastIndex, match.index));
      }
      // Add bold text
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-gray-900 dark:text-white">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < lineText.length) {
      parts.push(lineText.substring(lastIndex));
    }

    return parts.length === 1 ? parts[0] : <React.Fragment>{parts}</React.Fragment>;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle Table Row
    if (line.startsWith('|')) {
      flushList();
      flushQuote();
      isInsideTable = true;

      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1); // remove outer empty items

      // Check if it's separator row (e.g. |:---|:---|)
      const isSeparator = cells.every((cell) => cell.startsWith(':') || cell.startsWith('-') || cell.endsWith(':'));

      if (isSeparator) {
        continue;
      }

      if (tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Handle blockquotes
    if (line.startsWith('>')) {
      flushList();
      isInsideQuote = true;
      
      const content = line.substring(1).trim();
      
      if (content.startsWith('[!NOTE]')) {
        quoteType = 'note';
        quoteLines.push(content.substring(7).trim());
      } else if (content.startsWith('[!WARNING]')) {
        quoteType = 'warning';
        quoteLines.push(content.substring(10).trim());
      } else if (content.startsWith('[!IMPORTANT]')) {
        quoteType = 'important';
        quoteLines.push(content.substring(12).trim());
      } else {
        quoteLines.push(content);
      }
      continue;
    } else {
      flushQuote();
    }

    // Handle Headings
    if (line.startsWith('###')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold font-display text-gray-900 dark:text-white mt-4 mb-2 first:mt-0">
          {parseInlineStyles(line.substring(3).trim())}
        </h3>
      );
      continue;
    }

    if (line.startsWith('####')) {
      flushList();
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-semibold font-display text-gray-800 dark:text-gray-200 mt-3 mb-1">
          {parseInlineStyles(line.substring(4).trim())}
        </h4>
      );
      continue;
    }

    // Handle lists
    if (line.startsWith('*') || line.startsWith('-')) {
      const itemText = line.substring(1).trim();
      currentList.push(
        <li key={`li-${i}`} className="list-disc ml-5 mb-1 text-gray-600 dark:text-gray-300">
          {parseInlineStyles(itemText)}
        </li>
      );
      continue;
    } else {
      flushList();
    }

    // Regular Paragraph
    if (line) {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-3 last:mb-0">
          {parseInlineStyles(line)}
        </p>
      );
    } else if (i > 0 && lines[i - 1].trim()) {
      // Empty line adds standard spacing if previous line was not empty
      elements.push(<div key={`space-${i}`} className="h-2" />);
    }
  }

  // Final flushes
  flushList();
  flushQuote();
  flushTable();

  return elements;
};
