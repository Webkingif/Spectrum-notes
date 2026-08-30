import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, ChevronRight, Star } from 'lucide-react';
import { mockNotes } from '../data/mockNotes';

export default function NotesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const navigate = useNavigate();

  // 1. Automatically extract all unique tags from your notes
  const allAvailableTags = useMemo(() => {
    const tags = mockNotes.flatMap(note => note.tags);
    return Array.from(new Set(tags)).sort();
  }, []);

  // 2. The toggle function for tag pills
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) // Remove if already selected
        : [...prev, tag] // Add if not selected
    );
  };

  // 3. The updated filtering logic
  const filteredAndSortedNotes = useMemo(() => {
    return mockNotes
      .filter((note) => {
        // Search Filter
        const matchesSearch = 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Favorite Filter
        const matchesFavorite = showFavoritesOnly ? note.isFavorite : true;
        
        // Tag Filter (Returns true if NO tags are selected, OR if the note has AT LEAST ONE selected tag)
        const matchesTags = selectedTags.length === 0 
          ? true 
          : note.tags.some(tag => selectedTags.includes(tag));

        // Note must pass all active filters
        return matchesSearch && matchesFavorite && matchesTags;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [searchQuery, showFavoritesOnly, selectedTags]);

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-8">
      
      {/* HEADER: Title and New Note Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          All Notes
        </h1>
        <button
          onClick={() => navigate('/note/new')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow"
          />
        </div>

       {/* Filter Row (Now with horizontal scrolling!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Favorite Toggle Button */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border shrink-0 ${
              showFavoritesOnly
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Star size={14} className={showFavoritesOnly ? "fill-amber-500" : ""} />
            Favorites
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0"></div>

          {/* Dynamic Tag Pills */}
          {allAvailableTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTES LIST */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
        {filteredAndSortedNotes.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredAndSortedNotes.map((note) => (
              <div 
                key={note.id}
                onClick={() => navigate(`/note/${note.id}`)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-500 dark:text-slate-400 shrink-0 mt-0.5 relative">
                    <FileText size={20} />
                    {/* Tiny star indicator if it's a favorite */}
                    {note.isFavorite && (
                      <Star size={10} className="absolute -top-1 -right-1 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {note.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {note.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {note.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded text-[10px] font-medium uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">No notes found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Adjust your search or clear your filters to see more results.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}