import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";

import { useAuth } from '../context/AuthContext';

const AiChatSidebar = lazy(()=> import('./AiChatSidebar'))

function HeaderAndSidebar() {
	const [isSavedToCloud, setIsSavedToCloud] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isAiChatOpen, setIsAiChatOpen] = useState(false);

	const [aiContextText, setAiContextText] = useState("");
	
	const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
	const [noteTitle, setNoteTitle] = useState("Untitled Note");
	const [isSaving,setIsSaving] = useState(false);

	const sidebarRef = useRef<HTMLDivElement>(null);
	const editorContentRef = useRef<any>(null);
	const editorTextRef = useRef<string>("");
	const {user} = useAuth();
	
	const match = useMatch("/note/:id");
	const navigate = useNavigate();
	const currentNoteId = match?.params.id;
	
	const handleSaveClick = ()=>{
		const editorData = editorContentRef.current;
		if(!editorData){
			alert("Note is empty");
			return;
		}
		setIsTitleDialogOpen(true);
	}

	const confirmSave = async () => {
		
		
		console.log("Saved JSON Data:", editorContentRef.current);
		
		
		const editorData = editorContentRef.current;
		if(!editorData) return;
		
		setIsSaving(true);
		
		try{
			const isNewNote = !currentNoteId || currentNoteId== "new";
			const method = isNewNote? "POST" : "PUT";
			
			const endpoint = isNewNote
			? `${import.meta.env.VITE_API_URL}/api/notes`
			:`${import.meta.env.VITE_API_URL}/api/notes/${currentNoteId}`;
			
			const response = await fetch(endpoint, {
				method: method,
				headers: {"Content-Type": "application/json", "Authorization": `Bearer ${user?.token}`,},
				body: JSON.stringify({
					title: noteTitle,
					content: editorData,
				})
			})
			
			if(!response.ok) throw new Error (`HTTP error! status: ${response.status}`)
			
			const savedData = await response.json();
			console.log(`Successfully ${isNewNote? "created":"updated"}`);
			
			setIsTitleDialogOpen(false);
			setIsSavedToCloud(true);
			if(isNewNote && savedData._id){
				navigate(`/note/${savedData._id}`, {replace: true});
			}
			
			
			
		}catch(error){
			console.error("Error saving Note", error);
			alert("Failed to save note. Please check your connection");
		}finally{
			setIsSaving(false);
			
			setIsTitleDialogOpen(false);
		}
		

	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (isSidebarOpen && sidebarRef.current) {
				if (!sidebarRef.current.contains(target)) {
					if (!target.closest("#sidebar-toggle")) {
						setIsSidebarOpen(false);
					}
				}
			}
		};
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isSidebarOpen]);

	function onToggleSidebar() {
		setIsSidebarOpen(prev => !prev);
	}
	function onToggleAiChat() {
		setIsAiChatOpen(prev => !prev);
	}
	const openAiWithText = (text: string) => {
		setAiContextText(text);
		setIsAiChatOpen(true);
	};
	const updateEditorContent = (json: any, text: string) => {
		editorContentRef.current = json;
		editorTextRef.current = text;
		if (isSavedToCloud) { setIsSavedToCloud(false) };
		//console.log("This is the JSON from the editor", editorContentRef.current);
	}

	return (
		<div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
			<Header onToggleSidebar={onToggleSidebar} onSave={handleSaveClick} isSavedToCloud={isSavedToCloud} onToggleAiChat={onToggleAiChat} />

			{/*<div className="flex flex-1 overflow-hidden relative">*/}
			<div
				ref={sidebarRef}
				className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-0" : "-ml-64"}`}
			>
				<div className="w-64 h-full shrink-0">
					{/* sidebar goes here */}
					<Sidebar />
				</div>
			</div>
			<div className={`transition-all duration-300 ease-in-out z-20 border-l border-slate-200 dark:border-slate-700 shadow-xl`}>
				{/* 4. Pass the text down into the AI Sidebar */}
				{isAiChatOpen && (
					<Suspense fallback={<div className="flex flex-col h-[90vh] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-80 shrink-0 shadow-lg fixed right-0 z-50">Loading AI...</div>}>
					<AiChatSidebar onClose={() => setIsAiChatOpen(false)} highlightedText={aiContextText} getEditorText={()=> editorTextRef.current} />
					</Suspense>
					)}
			</div>
			<main className="overflow-y-auto min-h-[600px]">
				<Outlet context={{ setEditorContent: updateEditorContent, openAiWithText }} />
			</main>

			{/*</div>*/}
			
			{/* title modal overlay */}
			{isTitleDialogOpen && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
<div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">

<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
Name your note
</h3>

<input
type="text"
value={noteTitle}
onChange={(e) => setNoteTitle(e.target.value)}
placeholder="e.g., Project Meeting Notes"
className="w-full px-3 py-2 mb-6 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
autoFocus
/>

<div className="flex justify-end gap-3">
<button
onClick={() => setIsTitleDialogOpen(false)}
className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
disabled={isSaving}
>
Cancel
</button>

<button
onClick={confirmSave}
className="px-4 py-2 text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors flex items-center gap-2"
disabled={isSaving}
>
{isSaving ? "Saving..." : "Save Note"}
</button>
</div>

</div>
</div>
			)}


		</div>
	)
}

export default HeaderAndSidebar;



