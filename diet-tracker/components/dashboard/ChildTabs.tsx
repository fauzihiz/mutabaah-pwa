import React, { useState } from 'react';

interface Child {
    id?: number;
    name: string;
}

interface ChildTabsProps {
    children: Child[] | undefined;
    activeChildId: number;
    onTabChange: (id: number) => void;
    onAddChild: (name: string) => void;
    onUpdateChild: (id: number, name: string) => void;
    onRemoveChild: (id: number) => void;
}

export function ChildTabs({
    children,
    activeChildId,
    onTabChange,
    onAddChild,
    onUpdateChild,
    onRemoveChild
}: ChildTabsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newChildName, setNewChildName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newChildName.trim()) {
            onAddChild(newChildName.trim());
            setNewChildName('');
            setIsAdding(false);
        }
    };

    const handleEditSubmit = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        if (editName.trim()) {
            onUpdateChild(id, editName.trim());
            setEditingId(null);
        }
    };

    if (!children) return null;

    return (
        <div className="flex overflow-x-auto border-b border-[var(--border-color)] px-4 gap-2 pb-1 no-scrollbar">
            {children.map(child => (
                <div key={child.id} className="flex items-center">
                    {editingId === child.id ? (
                        <form onSubmit={(e) => handleEditSubmit(e, child.id!)} className="flex items-center">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1 text-sm bg-white border border-[var(--border-color)] rounded-lg text-black focus:outline-none"
                                autoFocus
                                onBlur={() => setEditingId(null)}
                            />
                        </form>
                    ) : (
                        <div
                            className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-xl cursor-pointer transition-colors flex items-center gap-2 ${activeChildId === child.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            onClick={() => onTabChange(child.id!)}
                        >
                            <span onDoubleClick={() => {
                                setEditingId(child.id!);
                                setEditName(child.name);
                            }}>
                                {child.name}
                            </span>
                            
                            {/* Small delete icon */}
                            {children.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Hapus tab ${child.name}?`)) {
                                            onRemoveChild(child.id!);
                                        }
                                    }}
                                    className="ml-1 text-xs opacity-60 hover:opacity-100"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
            
            {isAdding ? (
                <form onSubmit={handleAddSubmit} className="flex items-center ml-2">
                    <input
                        type="text"
                        value={newChildName}
                        onChange={(e) => setNewChildName(e.target.value)}
                        placeholder="Nama Anak"
                        className="px-3 py-1 text-sm bg-white border border-[var(--border-color)] rounded-lg text-black focus:outline-none"
                        autoFocus
                        onBlur={() => setIsAdding(false)}
                    />
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-xl cursor-pointer transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 ml-2"
                >
                    + Tambah Anak
                </button>
            )}
        </div>
    );
}
