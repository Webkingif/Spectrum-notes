import {Routes, Route, Outlet} from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import AiChatSidebar from "./AiChatSidebar.tsx";

function HeaderAndSidebar() {
  const [isSavedToCloud, setIsSavedToCloud] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  
  const [aiContextText, setAiContextText] = useState(""); 
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<any>(null);
  
  const handleSaveClick = () =>{
	setIsSavedToCloud(true);
	console.log("Saved JSON Data:", editorContentRef.current);
	
  };
  
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
  function onToggleAiChat(){
	setIsAiChatOpen(prev => !prev);
  }
  const openAiWithText = (text: string) => {
    setAiContextText(text);
    setIsAiChatOpen(true);
  };
  const updateEditorContent = (json:any)=>{
	editorContentRef.current = json;
	if(isSavedToCloud){setIsSavedToCloud(false)};
	//console.log("This is the JSON from the editor", editorContentRef.current);
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
		<Header onToggleSidebar={onToggleSidebar} onSave={handleSaveClick} isSavedToCloud={isSavedToCloud} onToggleAiChat={onToggleAiChat} />
		
		{/*<div className="flex flex-1 overflow-hidden relative">*/}
		<div 
			ref={sidebarRef}
			className={`transition-all duration-300 ease-in-out ${isSidebarOpen? "ml-0" : "-ml-64"}`}
		>
			<div className="w-64 h-full shrink-0">
				{/* sidebar goes here */}
				<Sidebar />
			</div>
		</div>
		<div className={`transition-all duration-300 ease-in-out z-20 border-l border-slate-200 dark:border-slate-700 shadow-xl`}>
          {/* 4. Pass the text down into the AI Sidebar */}
				{isAiChatOpen && <AiChatSidebar onClose={() => setIsAiChatOpen(false)} highlightedText={aiContextText} />}
		</div>
		<main className="overflow-y-auto min-h-[600px]">
			<Outlet context ={{setEditorContent: updateEditorContent, openAiWithText}} />
		</main>
      
      {/*</div>*/}

      
    </div>
  )
}

export default HeaderAndSidebar;



