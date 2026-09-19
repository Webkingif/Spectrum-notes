import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

interface AiChatSidebarProps {
  onClose: () => void;
  highlightedText?: string; 
  getEditorText: () => string;
}

// 1. Define what a message looks like
interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AiChatSidebar({ onClose, highlightedText = "", getEditorText }: AiChatSidebarProps) {
  // 2. State for the input field
  const [inputValue, setInputValue] = useState("");
  
  // 3. State for the conversation history (starts with a greeting)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! Highlight any text in your editor and click "Ask AI", or just ask me a question directly.' }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle incoming highlighted text
  useEffect(() => {
    if (highlightedText) {
      setInputValue(`Explain this: "${highlightedText}"`);
    }
  }, [highlightedText]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 4. Immediately add the user's message to the chat UI and clear the input
    const userMessage = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          question: userMessage, // Send the saved string, not the cleared state!
          context: getEditorText()
        })
      });
      
      const data = await response.json();
      
      // 5. Add the AI's response to the chat UI
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I had trouble processing that request." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[90vh] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 w-80 shrink-0 shadow-lg fixed right-0 z-50">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          AI Assistant
        </h2>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <X size={18} />
        </button>
      </div>
	  
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 max-w-[85%] rounded-lg whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-tr-none' // User bubble
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-600' // AI bubble
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 max-w-[85%] rounded-lg rounded-tl-none bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-100">●</span>
              <span className="animate-bounce delay-200">●</span>
            </div>
          </div>
        )}
        
        {/* Invisible div to scroll down to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <form onSubmit={handleAsk} className="relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Ask AI anything..." 
            className="w-full text-slate-900 dark:text-slate-50 pl-3 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1.5 p-1 rounded-md text-orange-500 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-orange-500" 
          >
            <Send size={16} />
          </button>
		    </form>
      </div>
    </div>
  );
}