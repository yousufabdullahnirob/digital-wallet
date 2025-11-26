import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';
import ExpenseTracker from '../components/ExpenseTracker';
import Masonry from 'react-masonry-css';
import { Plus, Search, X, Menu, LayoutGrid, FileText, DollarSign, Bell } from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);

  const [currentView, setCurrentView] = useState('notes');
  const [folders, setFolders] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, foldersRes] = await Promise.all([
          api.get('notes/'),
          api.get('folders/')
        ]);

        setNotes(notesRes.data);
        setFilteredNotes(notesRes.data);
        setFolders(foldersRes.data);

        const tags = new Set();
        notesRes.data.forEach(note => {
          note.tags.forEach(tag => tags.add(tag.name));
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchData();
  }, []);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      notes.forEach(note => {
        if (note.reminder && !note.is_trashed && !note.is_archived) {
          const reminderTime = new Date(note.reminder);
          // Check if reminder is due within the last minute (to avoid repeated alerts for old reminders, though this logic is simple)
          // A better approach would be to track 'notified' state locally or on backend.
          // For now, we'll just check if it's effectively "now" (e.g. within last 60s)
          const diff = now - reminderTime;
          if (diff >= 0 && diff < 60000) {
            if (Notification.permission === 'granted') {
              new Notification(`Reminder: ${note.title || 'Untitled Note'}`, {
                body: note.body || 'You have a reminder!',
                icon: '/vite.svg'
              });
            } else if (Notification.permission !== 'denied') {
              // Only try to request if not denied, or just log
              console.log('Notification permission needed for reminder:', note.title);
            }
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [notes]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const noteId = active.data.current.note.id;
    const overId = over.id;

    if (overId.startsWith('folder-')) {
      const folderId = overId.replace('folder-', '');
      try {
        await api.patch(`notes/${noteId}/`, { folder: folderId });
        // Update local state
        setNotes(prev => prev.map(note =>
          note.id === noteId ? { ...note, folder: parseInt(folderId) } : note
        ));
        // Optionally show success message
        console.log(`Moved note ${noteId} to folder ${folderId}`);
      } catch (error) {
        console.error('Error moving note:', error);
      }
    }
  };

  useEffect(() => {
    let result = notes;

    // Filter by View (Notes, Archive, Trash, Reminders)
    if (currentView === 'notes') {
      result = result.filter(note => !note.is_archived && !note.is_trashed);
    } else if (currentView === 'reminders') {
      result = result.filter(note => note.reminder && !note.is_trashed && !note.is_archived);
    } else if (currentView === 'archive') {
      result = result.filter(note => note.is_archived && !note.is_trashed);
    } else if (currentView === 'trash') {
      result = result.filter(note => note.is_trashed);
    } else {
      // Default to notes if unknown view (e.g. labels for now)
      result = result.filter(note => !note.is_archived && !note.is_trashed);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.body.toLowerCase().includes(query)
      );
    }

    if (selectedTag) {
      result = result.filter(note =>
        note.tags.some(tag => tag.name === selectedTag)
      );
    }

    setFilteredNotes(result);
  }, [searchQuery, selectedTag, notes, currentView]);

  const breakpointColumnsObj = {
    default: 3,
    1536: 3,
    1280: 2,
    1024: 2,
    640: 1
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] transition-colors duration-300 font-sans text-[var(--text-primary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 glass-panel z-20 h-16 flex items-center px-4 md:px-6 transition-all duration-300">
        <div className="flex items-center gap-3 w-64">
          <button className="p-2 hover:bg-[var(--accent-secondary)] rounded-lg text-[var(--text-secondary)] transition-colors md:hidden">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center text-[var(--bg-primary)] shadow-sm">
              <LayoutGrid size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Dashboard</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[var(--text-secondary)] group-focus-within:text-[var(--text-primary)] transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-color)] rounded-xl focus:bg-[var(--card-bg)] focus:ring-2 focus:ring-[var(--border-color)] focus:shadow-sm outline-none transition-all placeholder-[var(--text-secondary)] text-sm font-medium"
              placeholder="Search notes..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="w-64 flex justify-end items-center gap-4">
          <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--accent-secondary)] rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-zinc-900"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-200 to-indigo-200 border-2 border-[var(--card-bg)] shadow-sm cursor-pointer hover:ring-2 hover:ring-[var(--border-color)] transition-all" />
        </div>
      </header>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex pt-16">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} folders={folders} />

          <main className="flex-1 p-6 md:p-8 max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Main Content Area (Notes) */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Tag Filters */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${selectedTag === null
                      ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] shadow-md'
                      : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${selectedTag === tag
                        ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] shadow-md'
                        : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-4"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="mb-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5 h-64 flex flex-col gap-4">
                      <div className="h-4 w-3/4 skeleton rounded" />
                      <div className="h-3 w-full skeleton rounded" />
                      <div className="h-3 w-5/6 skeleton rounded" />
                      <div className="mt-auto flex gap-2">
                        <div className="h-5 w-12 skeleton rounded-md" />
                      </div>
                    </div>
                  ))}
                </Masonry>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-24 opacity-60">
                  <div className="bg-[var(--accent-secondary)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-[var(--text-primary)] text-lg font-medium">No notes found</p>
                  <p className="text-[var(--text-secondary)] text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-4"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {filteredNotes.map(note => (
                    <div key={note.id} className="mb-6">
                      <NoteCard note={note} />
                    </div>
                  ))}
                </Masonry>
              )}
            </div>

            {/* Right Sidebar (Widgets) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <ExpenseTracker />

              {/* Pro Tip Widget */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg hidden xl:block relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">Pro Tip</h3>
                <p className="text-indigo-100 text-sm leading-relaxed relative z-10">
                  Organize your thoughts by dragging and dropping notes into custom folders.
                </p>
              </div>
            </div>

          </main>
        </div>
      </DndContext>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3">
        {fabOpen && (
          <>
            <Link to="/create" className="flex items-center gap-3 bg-[var(--card-bg)] text-[var(--text-primary)] px-5 py-2.5 rounded-full shadow-lg hover:bg-[var(--accent-secondary)] transition-all animate-in slide-in-from-bottom-4 border border-[var(--border-color)]">
              <span className="text-sm font-medium">Reminder</span>
              <Bell size={18} className="text-[var(--text-secondary)]" />
            </Link>
            <button className="flex items-center gap-3 bg-[var(--card-bg)] text-[var(--text-primary)] px-5 py-2.5 rounded-full shadow-lg hover:bg-[var(--accent-secondary)] transition-all animate-in slide-in-from-bottom-4 delay-75 border border-[var(--border-color)]">
              <span className="text-sm font-medium">Expense</span>
              <DollarSign size={18} className="text-[var(--text-secondary)]" />
            </button>
            <Link
              to="/create"
              className="flex items-center gap-3 bg-[var(--card-bg)] text-[var(--text-primary)] px-5 py-2.5 rounded-full shadow-lg hover:bg-[var(--accent-secondary)] transition-all animate-in slide-in-from-bottom-4 delay-100 border border-[var(--border-color)]"
            >
              <span className="text-sm font-medium">New Note</span>
              <FileText size={18} className="text-[var(--text-secondary)]" />
            </Link>
          </>
        )}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-2xl shadow-xl shadow-[var(--accent-primary)]/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 ${fabOpen ? 'rotate-45' : ''}`}
        >
          <Plus size={28} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Home;
