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
      <div className="bg-app-surface/50 border border-app-border/30 backdrop-blur-sm rounded-2xl p-4 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-text text-base">Conversations</h3>
          <button
            onClick={onCreateNewChat}
            className="p-2 bg-app-bg hover:bg-app-bg/80 text-app-text border border-app-border/30 rounded-lg transition-all"
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
                  ? 'bg-app-bg border border-app-border/50'
                  : 'bg-app-bg/30 border border-app-border/20 hover:bg-app-bg/50'
              } ${renamingChatId === session.id ? 'cursor-default' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {renamingChatId === session.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        onKeyDown={(e) => onRenameKeyPress(session.id, e)}
                        className="rename-input flex-1 bg-app-bg border border-app-border rounded px-2 py-1 text-sm text-app-text focus:outline-none focus:ring-1 focus:ring-app-border/50"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveRenamedChat(session.id);
                        }}
                        className="p-1 text-app-text hover:text-app-text/80 transition-colors font-medium"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelRenaming();
                        }}
                        className="p-1 text-app-text-muted hover:text-app-text transition-colors font-medium"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-app-text truncate">
                        {session.title}
                      </p>
                      {session.lastMessage && (
                        <p className="text-xs text-app-text-muted/70 truncate mt-1">
                          {session.lastMessage}
                        </p>
                      )}
                      <p className="text-xs text-app-text-muted/60 mt-1">
                        {session.messageCount} messages
                      </p>
                    </>
                  )}
                </div>
                {renamingChatId !== session.id && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => onStartRenaming(session.id, session.title, e)}
                      className="p-1 text-app-text-muted hover:text-app-text transition-colors"
                      title="Rename Chat"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => onDeleteChat(session.id, e)}
                        className="p-1 text-app-text-muted hover:text-app-text transition-colors"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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