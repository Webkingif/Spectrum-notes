import { useState, useRef, useEffect } from 'react';
import { Menu, Sparkles, Save, MoreHorizontal, CloudCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onSave?: () => void;
  isSavedToCloud: boolean;
  onToggleAiChat?: () => void;
}

const Header = ({ onToggleSidebar, onSave, isSavedToCloud, onToggleAiChat }: HeaderProps) => {
  // 1. State and refs for the mobile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Navigate back to sign in
    navigate('/signin');
  };

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
          <span className="hidden md:flex">
            <span className="hover:text-slate-900 dark:hover:text-slate-50 cursor-pointer transition-colors">Workspace</span>
            <span>/</span>
          </span>
          <span className="text-slate-900 dark:text-slate-50 w-10px overflow-hidden">AI App Specs</span>
        </nav>
      </div>

      {/* CENTER: Status & Title */}
      <div className="flex items-center justify-center w-1/3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {!isSavedToCloud ? (
            <span className="animate-pulse">Not Saved</span>
          ) : (
            <>
              <CloudCheck size={14} />
              <span>Saved to cloud</span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Global Actions & AI */}
      {/* 3. Wrap right side in ref to detect clicks outside */}
      <div className="flex items-center justify-end gap-3 w-1/3 relative" ref={dropdownRef}>

        {/* The AI Action Button (hidden on mobile, visible on sm and up) */}
        <button
          className="hidden sm:flex no-wrap items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-500 hover:bg-orange-200 dark:hover:bg-orange-900/80 rounded-md text-sm font-medium transition-colors"
          onClick={onToggleAiChat}
        >
          <Sparkles size={16} />
          <span>Ask AI</span>
        </button>

        {/* Share/Save Button (hidden on mobile, visible on sm and up) */}
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-50 hover:bg-slate-200 active:bg-slate-400 dark:hover:bg-slate-800 rounded-md transition-colors"
          onClick={onSave}
        >
          <Save size={16} />
          <span>Save</span>
        </button>

        {/* More Menu (visible ONLY on mobile) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="sm:hidden p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 rounded-md transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* 4. The Dropdown Menu for Mobile */}
        {isDropdownOpen && (
          <div className="absolute top-10 right-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg py-1 z-50 flex flex-col sm:hidden">
            <button
              onClick={() => { onToggleAiChat?.(); setIsDropdownOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 dark:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
            >
              <Sparkles size={16} />
              Ask AI
            </button>

            <button
              onClick={() => { onSave?.(); setIsDropdownOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
            >
              <Save size={16} />
              Save Note
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}

      </div>

    </header>
  );
};

export default Header;