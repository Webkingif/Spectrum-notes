import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import { 
  Search, 
  Home, 
  Star, 
  FileText,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  // We can pass the activfe route or use React Router's <NavLink> later
  activeItem?: string; 
}

interface Note{
	_id: string;
	title: string;
	excerpt: string;
	isFavorite: boolean;
	tags:string[];
	updatedAt: string[]
}

const Sidebar = ({ activeItem = 'home' }:SidebarProps) => {
const [notes, setNotes] = useState<Note[]>([]);
const navigate = useNavigate();
const {user} = useAuth();
  
  useEffect(()=>{
	const fetchNotes = async ()=>{
	if(!user?.token) return;
		try{
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`,{
				headers:{
					"Authorization": `Bearer ${user.token}`,
				}
			});
			if(!response.ok) throw new Error("failed to fetch notes");
			const data = await response.json();
			setNotes(data);
		}catch(error){
			console.error("Error fetching notes:", error);
		}
	};
	fetchNotes();
  },[user]);
  return (
    <aside className="w-64 h-[90vh] flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 font-sans transition-colors duration-200 fixed z-900">
      
      {/* 1. Workspace Profile & New Note Button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
            W
          </div>
          <Link to="/notes"><span className="font-medium text-slate-900 hover:text-orange-500 active:underline dark:text-slate-50 text-sm">My Workspace</span></Link>
        </div>
        
        {/* Primary Action Button (Brand Orange) */}
        <button className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
			onClick={() => navigate('/note/new')}
		>
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        
        {/* Core Links */}
        <div className="space-y-1">
          <SidebarItem icon={<Search size={18} />} label="Search" />
          <Link to="/notes"><SidebarItem 
            icon={<Home size={18} />} 
            label="All Notes" 
            isActive={activeItem === 'home'} 
          /></Link>
          <SidebarItem icon={<Star size={18} />} label="Favorites" />
        </div>

        {/* File Tree / Recent Notes */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Notes
          </h3>
          <div className="space-y-1">
		  {notes.map((note)=>{
			return ( <Link to={`/note/${note._id}`}> <SidebarItem icon={<FileText size={18} />} label={note.title} key={note._id} /> </Link>)
		  })}
            
          </div>
        </div>
      </nav>

      {/* 3. Footer Navigation */}
      {/*<div className="p-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
        <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>*/}

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
      className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-500' // Active state uses your brand colors
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50'
      }`}
      key={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};