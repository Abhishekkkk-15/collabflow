"use client";

import {
  Plus,
  FileText,
  Trash2,
  Search,
  Star,
  Copy,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
// import { Note } from '../lib/supabase';
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
type Note = any;
interface AdvancedNotesSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onDuplicateNote: (noteId: string) => void;
  favorites: string[];
}

type SortBy = "updated" | "created" | "title" | "favorites";

export function AdvancedNotesSidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onToggleFavorite,
  onDuplicateNote,
  favorites,
}: AdvancedNotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("updated");
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

  const filterAndSortNotes = () => {
    let filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "favorites":
        return filtered.sort((a, b) => {
          const aIsFav = favorites.includes(a.id);
          const bIsFav = favorites.includes(b.id);
          if (aIsFav === bIsFav) {
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          }
          return aIsFav ? -1 : 1;
        });
      case "created":
        return filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case "updated":
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const sortedNotes = filterAndSortNotes();

  return (
    <TooltipProvider>
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Notes</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onCreateNote} size="icon" variant="ghost">
                  <Plus className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New note</TooltipContent>
            </Tooltip>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="updated">Updated</option>
              <option value="created">Created</option>
              <option value="title">Title</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {sortedNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? "No notes found" : "No notes yet"}
            </div>
          ) : (
            <div className="py-2">
              {sortedNotes.map((note) => {
                const isFavorite = favorites.includes(note.id);
                const isSelected = selectedNoteId === note.id;

                return (
                  <div
                    key={note.id}
                    className={`group relative px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-l-2 ${
                      isSelected
                        ? "bg-gray-100 border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => onSelectNote(note.id)}>
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {note.title || "Untitled"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.updated_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(note.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded">
                              <Star
                                className={`w-4 h-4 ${
                                  isFavorite
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateNote(note.id);
                              }}
                              className="p-1 hover:bg-gray-200 rounded">
                              <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicate</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNote(note.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </div>
      </div>
    </TooltipProvider>
  );
}
