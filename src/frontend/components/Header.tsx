//import React from 'react';
import { Menu, Sparkles, Share, MoreHorizontal, CloudCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSaving?: boolean;
}

const Header = ({ onToggleSidebar, isSaving = false }:HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-sans transition-colors duration-200">
      
      {/* LEFT: Navigation & Context */}
      <div className="flex items-center gap-3 w-1/3">
        <button 
			id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="hover:text-slate-900 dark:hover:text-slate-50 cursor-pointer transition-colors">Workspace</span>
          <span>/</span>
          <span className="hover:text-slate-900 dark:hover:text-slate-50 cursor-pointer transition-colors">Projects</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-50">AI App Specs</span>
        </nav>
      </div>

      {/* CENTER: Status & Title */}
      <div className="flex items-center justify-center w-1/3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {isSaving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <CloudCheck size={14} />
              <span>Saved to cloud</span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Global Actions & AI */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        
        {/* The AI Action Button (Using the Brand Subdued / Primary Orange) */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-500 hover:bg-orange-200 dark:hover:bg-orange-900/80 rounded-md text-sm font-medium transition-colors">
          <Sparkles size={16} />
          <span>Ask AI</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
          <Share size={16} />
          <span>Share</span>
        </button>

        {/* More Menu */}
        <button className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 rounded-md transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

    </header>
  );
};

export default Header;