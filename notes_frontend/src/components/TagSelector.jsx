import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TagSelector = ({ tags, setTags, availableTags = [] }) => {
    const [input, setInput] = useState('');

    const handleAddTag = () => {
        if (!input.trim()) return;
        const newTag = input.trim();
        if (!tags.includes(newTag)) {
            setTags([...tags, newTag]);
        }
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const toggleTag = (tag) => {
        if (tags.includes(tag)) {
            removeTag(tag);
        } else {
            setTags([...tags, tag]);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-blue-900">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Add a tag..."
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-gray-500 w-full">Suggested:</span>
                    {availableTags.filter(t => !tags.includes(t)).map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors border border-gray-200"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TagSelector;
