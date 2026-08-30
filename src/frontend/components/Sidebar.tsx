
import { 
  Search, 
  Home, 
  Star, 
  Settings, 
  Trash2, 
  MessageSquare, 
  FileText,
  Plus
} from 'lucide-react';

interface SidebarProps {
  // We can pass the activfe route or use React Router's <NavLink> later
  activeItem?: string; 
}

const Sidebar = ({ activeItem = 'home' }:SidebarProps) => {
  return (
    <aside className="w-64 h-[90vh] flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 font-sans transition-colors duration-200 fixed">
      
      {/* 1. Workspace Profile & New Note Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
            W
          </div>
          <span className="font-medium text-slate-900 dark:text-slate-50 text-sm">My Workspace</span>
        </div>
        
        {/* Primary Action Button (Brand Orange) */}
        <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        
        {/* Core Links */}
        <div className="space-y-1">
          <SidebarItem icon={<Search size={18} />} label="Search" />
          <SidebarItem 
            icon={<Home size={18} />} 
            label="Home" 
            isActive={activeItem === 'home'} 
          />
          <SidebarItem icon={<Star size={18} />} label="Favorites" />
          <SidebarItem 
            icon={<MessageSquare size={18} />} 
            label="AI Chat" 
            isActive={activeItem === 'ai-chat'}
          />
        </div>

        {/* File Tree / Recent Notes */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Notes
          </h3>
          <div className="space-y-1">
            <SidebarItem icon={<FileText size={18} />} label="AI App Specs" isActive={activeItem === 'specs'} />
            <SidebarItem icon={<FileText size={18} />} label="Meeting Notes" />
            <SidebarItem icon={<FileText size={18} />} label="Journal - Aug 17" />
          </div>
        </div>
      </nav>

      {/* 3. Footer Navigation */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
        <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>

    </aside>
  );
};

export default Sidebar;

// --- Sub-component for individual sidebar links ---

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, isActive = false }:SidebarItemProps) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-500' // Active state uses your brand colors
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};