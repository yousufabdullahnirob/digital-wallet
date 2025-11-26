import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Folder as FolderIcon } from 'lucide-react';

const FolderItem = ({ folder, isActive, onClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `folder-${folder.id}`,
        data: { type: 'folder', folder }
    });

    return (
        <button
            ref={setNodeRef}
            onClick={onClick}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${isActive
                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-md'
                : isOver
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--text-primary)]'
                }`}
        >
            <span className={`flex items-center justify-center transition-colors ${isActive ? 'text-[var(--bg-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                } mr-3`}>
                <FolderIcon size={20} />
            </span>
            <span className="truncate">{folder.name}</span>
        </button>
    );
};

const FolderList = ({ folders, currentView, onViewChange }) => {
    return (
        <div className="space-y-1 mt-2">
            <div className="px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 mt-4">
                Folders
            </div>
            {folders.map(folder => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    isActive={currentView === `folder-${folder.id}`}
                    onClick={() => onViewChange(`folder-${folder.id}`)}
                />
            ))}
        </div>
    );
};

export default FolderList;
