"use client";

import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ChatSession } from '../../../lib/services';

interface ChatSessionsSidebarProps {
  chatSessions: ChatSession[];
  currentChatSessionId: string | null;
  onCreateNewChat: () => void;
  onSwitchToChat: (chatSessionId: string) => void;
  onDeleteChat: (chatSessionId: string, event: React.MouseEvent) => void;
  onStartRenaming: (chatSessionId: string, currentTitle: string, event: React.MouseEvent) => void;
  onSaveRenamedChat: (chatSessionId: string) => void;
  onCancelRenaming: () => void;
  renamingChatId: string | null;
  newChatName: string;
  setNewChatName: (name: string) => void;
  onRenameKeyPress: (chatSessionId: string, event: React.KeyboardEvent) => void;
}

export default function ChatSessionsSidebar({
  chatSessions,
  currentChatSessionId,
  onCreateNewChat,
  onSwitchToChat,
  onDeleteChat,
  onStartRenaming,
  onSaveRenamedChat,
  onCancelRenaming,
  renamingChatId,
  newChatName,
  setNewChatName,
  onRenameKeyPress
}: ChatSessionsSidebarProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Chat History</h3>
          <button
            onClick={onCreateNewChat}
            className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => !renamingChatId && onSwitchToChat(session.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                session.id === currentChatSessionId
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : 'bg-slate-700/30 hover:bg-slate-700/50'
              } ${renamingChatId === session.id ? 'cursor-default' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {renamingChatId === session.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        onKeyDown={(e) => onRenameKeyPress(session.id, e)}
                        className="rename-input flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveRenamedChat(session.id);
                        }}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelRenaming();
                        }}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-white truncate">
                        {session.title}
                      </p>
                      {session.lastMessage && (
                        <p className="text-xs text-slate-400 truncate mt-1">
                          {session.lastMessage}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {session.messageCount} messages
                      </p>
                    </>
                  )}
                </div>
                {renamingChatId !== session.id && (
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => onStartRenaming(session.id, session.title, e)}
                      className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Rename Chat"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => onDeleteChat(session.id, e)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}