import React, { useState } from 'react';
import { Lightbulb, Bell, Tag, Trash2, Archive, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FolderList from './FolderList';

const Sidebar = ({ className = '', currentView = 'notes', onViewChange, folders = [] }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'notes', icon: <Lightbulb size={20} />, label: 'Notes' },
    { id: 'reminders', icon: <Bell size={20} />, label: 'Reminders' },
    { id: 'labels', icon: <Tag size={20} />, label: 'Edit labels' },
    { id: 'archive', icon: <Archive size={20} />, label: 'Archive' },
    { id: 'trash', icon: <Trash2 size={20} />, label: 'Trash' },
  ];

  return (
    <aside
      className={`flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col z-10 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-72'
        } ${className}`}
    >
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange && onViewChange(item.id)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${currentView === item.id
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]'
              } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className={`flex items-center justify-center transition-colors ${currentView === item.id ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
              } ${collapsed ? '' : 'mr-3'}`}>
              {item.icon}
            </span>

            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </button>
        ))}

        {!collapsed && (
          <FolderList folders={folders} currentView={currentView} onViewChange={onViewChange} />
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[var(--border-color)] space-y-2 bg-[var(--sidebar-bg)]">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)] ${collapsed ? 'justify-center' : ''}`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {!collapsed && <span className="ml-3">Dark Mode</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)] ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-3">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
