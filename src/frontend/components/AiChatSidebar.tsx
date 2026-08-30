import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface AiChatSidebarProps {
  onClose: () => void;
  // 1. Add a prop to catch the highlighted text
  highlightedText?: string; 
}

export default function AiChatSidebar({ onClose, highlightedText = "" }: AiChatSidebarProps) {
  // 2. Control the input field with state
  const [inputValue, setInputValue] = useState("");

  // 3. Whenever highlighted text is sent over, put it in the input!
  useEffect(() => {
    if (highlightedText) {
      setInputValue(`Explain this: "${highlightedText}"`);
    }
  }, [highlightedText]);

  return (
<>
    <div className="flex flex-col h-[90vh] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-80 shrink-0 shadow-lg fixed right-0">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          AI Assistant
        </h2>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg rounded-tl-none border border-slate-100 dark:border-slate-700">
          Hi! Highlight any text in your editor and click "Ask AI" to send it to me.
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          {/* 4. Connect the input to your state */}
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask AI anything..." 
            className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button className="absolute right-2 top-1.5 p-1 text-orange-500 hover:text-orange-600 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
</>
  );
}
