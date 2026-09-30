import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Star, ChevronRight, FileText, Trash2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Note {
  _id: string;
  title: string;
  excerpt: string;
  isFavorite: boolean;
  tags: string[];
  updatedAt: string[]
}


export default function NotesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
          headers: {
            "Authorization": `Bearer ${user.token}`,
          }
        });
        if (!response.ok) throw new Error("failed to fetch notes");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [user]);


  // 1. Automatically extract all unique tags from your notes
  const allAvailableTags = useMemo(() => {
    const tags = notes.flatMap(note => note.tags);
    return Array.from(new Set(tags)).sort();
  }, [notes]);

  // 2. The toggle function for tag pills
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove if already selected
        : [...prev, tag] // Add if not selected
    );
  };

  // 3. The updated filtering logic
  const filteredAndSortedNotes = notes.filter((note) => {
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

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stops the click from opening the note!

    // Optional: Ask for confirmation so they don't accidentally delete things
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      // Send the DELETE request to the backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        }
      });


      if (!response.ok) throw new Error('Failed to delete note');

      // Instantly remove it from the UI list without reloading the page
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));



    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note.");
    }
  };

  const getMaxNotes = () => {
    if (user?.tier === 'plus') return 6;
    if (user?.tier === 'free') return 3;
    return Infinity; // Pro tier
  };

  const maxNotes = getMaxNotes();
  const currentNotes = user?.noteCount || 0;

  const progressPercent = maxNotes === Infinity
    ? 100
    : Math.min((currentNotes / maxNotes) * 100, 100);




  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-8">

      {/* HEADER & USAGE PROGRESS SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl dark:bg-slate-800/50 dark:border-slate-700">

        <div className="flex-1 w-full">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            All Notes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Current Plan: <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">{user?.tier || 'Free'}</span>
          </p>

          {/* The Progress Bar (Hidden for Pro users) */}
          {user?.tier !== 'pro' && (
            <div className="mt-5 w-full max-w-sm">
              <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-600 dark:text-slate-400">
                <span>Storage Used</span>
                <span className={currentNotes >= maxNotes ? 'text-red-500 font-bold' : ''}>
                  {currentNotes} / {maxNotes}
                </span>
              </div>

              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${currentNotes >= maxNotes ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Upgrade nudge if they are 1 note away from the limit or at the limit */}
              {currentNotes >= maxNotes - 1 && (
                <button
                  onClick={() => navigate('/billing')}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Upgrade to unlock more space &rarr;
                </button>
              )}
            </div>
          )}
        </div>

        {/* New Note Button */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">

          {/* 1. The New Billing/Upgrade Button */}
          {user?.tier !== 'pro' && (
            <button
              onClick={() => navigate('/billing')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md shrink-0 focus:ring-2 focus:ring-purple-500/50"
            >
              <Zap size={16} className="fill-white/20" />
              <span>Upgrade Plan</span>
            </button>
          )}

          {/* 2. Your Existing New Note Button */}
          <button
            onClick={() => {
              if (user?.noteCount && user?.noteCount >= 3 && user.tier === "free") {
                alert("Users on the free plan can only create 3 notes.");
                navigate('/billing');
              } else if (user?.noteCount && user?.noteCount >= 6 && user.tier === "plus") {
                alert("Users on the plus plan can only create a maximum of 6 notes.");
                navigate('/billing');
              } else {
                navigate('/note/new');
              }
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
          >
            <Plus size={18} />
            <span>New Note</span>
          </button>
        </div>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border shrink-0 ${showFavoritesOnly
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border whitespace-nowrap shrink-0 ${isSelected
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
                key={note._id}
                onClick={() => navigate(`/note/${note._id}`)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-md text-slate-500 dark:text-slate-400 shrink-0 mt-0.5 relative">
                    <FileText size={20} />
                    {/* Tiny star indicator if it's a favorite */}
                    {note.isFavorite && (
                      <Star size={10} className="absolute -top-1 -right-1 text-amber-500 fill-amber-500" />
                    )}
                    <button
                      onClick={(e) => handleDeleteNote(e, note._id)}
                      className="p-1 text-red-300 dark:text-red-700 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded group-hover:opacity-100 transition-all"
                      title="Delete Note"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {note.title || "Untitled title"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {note.excerpt || "No excerpt yet"}
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