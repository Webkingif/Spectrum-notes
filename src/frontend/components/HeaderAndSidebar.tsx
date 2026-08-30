import {Routes, Route, Outlet} from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";

function HeaderAndSidebar() {
  const [count, setCount] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(()=>{
	const handleClickOutside = (event: MouseEvent)=>{
		const target = event.target as Element;
		if(isSidebarOpen && sidebarRef.current){
			if(!sidebarRef.current.contains(target)){
				if(!target.closest("#sidebar-toggle")){
					setIsSidebarOpen(false);
				}
			}
		}
	};
	document.addEventListener("mousedown", handleClickOutside);
	
	return ()=>{
		document.removeEventListener("mousedown", handleClickOutside);
	}
  },[isSidebarOpen]);
  
  function onToggleSidebar(){
	setIsSidebarOpen(prev=> !prev);
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
		<Header onToggleSidebar={onToggleSidebar} />
		
		
		<div 
			ref={sidebarRef}
			className={`transition-all duration-300 ease-in-out ${isSidebarOpen? "ml-0" : "-ml-64"}`}
		>
			<div className="w-64 h-full shrink-0">
				{/* sidebar goes here */}
				<Sidebar />
			</div>
		</div>
		<main>
			<Outlet />
		</main>
      

      
    </div>
  )
}

export default HeaderAndSidebar;



