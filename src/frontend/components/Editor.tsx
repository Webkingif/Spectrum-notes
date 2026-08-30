import { ReactNode } from 'react';
import { useOutletContext } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Sparkles } from 'lucide-react';
import { SlashCommandExtension } from './SlashCommand';

interface TiptapEditorProps {
  onChange?: (json: any) => void;
}

interface EditorContext {
  setEditorContent: (json: any) => void;
  openAiWithText: (text: string) => void;
}

const TiptapEditor = ({ onChange }: TiptapEditorProps) => {
  const { setEditorContent, openAiWithText } = useOutletContext<EditorContext>();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing, or type "/" for commands...',
      }),
      SlashCommandExtension,
    ],
    content: '',
    // Combined both onUpdate actions into one!
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      if (onChange) onChange(json);
      setEditorContent(json);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[700px] [--tw-prose-bullets:#000] dark:[--tw-prose-invert-bullets:#fff]',
      },
    },
  });

  return (
    <div className="w-[90%] md:w-full max-w-[750px] mx-auto mt-0 sm:mt-8 bg-white dark:bg-slate-800 p-4 sm:p-8 md:p-12 sm:rounded-lg shadow-none sm:shadow-sm border-y sm:border-x border-slate-200 dark:border-slate-700 max-h-[85vh] overflow-y-auto">
      
      {/* THE BUBBLE MENU */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-1"
        >
          {/* AI Action Button (Orange) */}
          <button 
            onClick={() => {
              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to);
              openAiWithText(selectedText);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-500 hover:bg-orange-200 dark:hover:bg-orange-900/80 rounded-md text-sm font-medium transition-colors mr-2"
          >
            <Sparkles size={14} />
            <span>Ask AI</span>
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Standard Formatting Buttons */}
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
            icon={<Bold size={16} />} 
          />
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
            icon={<Italic size={16} />} 
          />
          <MenuButton 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            isActive={editor.isActive('strike')}
            icon={<Strikethrough size={16} />} 
          />
        </BubbleMenu>
      )}

      {/* THE ACTUAL EDITOR */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;

// --- Helper Component for Formatting Buttons ---
interface MenuButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: ReactNode;
}

const MenuButton = ({ onClick, isActive, icon }: MenuButtonProps) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded-md transition-colors ${
      isActive 
        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {icon}
  </button>
);