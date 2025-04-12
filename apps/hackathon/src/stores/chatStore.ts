import { sync } from "@tonk/keepsync";
import { create } from "zustand";

export type ChatChannel = 'public' | 'tasks' | 'direct';

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  channel: ChatChannel;
  relatedTaskId?: string;
  recipientId?: string;
  type: 'message' | 'task_update' | 'task_assignment';
}

interface ChatState {
  messages: ChatMessage[];
  currentUserId: string | null;
  setCurrentUser: (userId: string) => void;
  addMessage: (userId: string, content: string, channel: ChatChannel, options?: { relatedTaskId?: string, recipientId?: string }) => void;
  addSystemMessage: (content: string, type: 'task_update' | 'task_assignment', relatedTaskId: string) => void;
  getChannelMessages: (channel: ChatChannel, userId?: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>(
  sync(
    (set, get) => ({
      messages: [],
      currentUserId: null,
      setCurrentUser: (userId: string) =>
        set({ currentUserId: userId }),
      addMessage: (userId: string, content: string, channel: ChatChannel, options = {}) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              userId,
              content,
              timestamp: new Date().toISOString(),
              channel,
              relatedTaskId: options.relatedTaskId,
              recipientId: options.recipientId,
              type: 'message'
            },
          ],
        })),
      addSystemMessage: (content: string, type: 'task_update' | 'task_assignment', relatedTaskId: string) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              userId: 'system',
              content,
              timestamp: new Date().toISOString(),
              channel: 'tasks',
              relatedTaskId,
              type
            },
          ],
        })),
      getChannelMessages: (channel: ChatChannel, userId?: string) => {
        const state = get();
        return state.messages.filter(msg => {
          if (channel === 'direct' && userId) {
            return (
              msg.channel === 'direct' &&
              ((msg.userId === userId && msg.recipientId === get().currentUserId) ||
               (msg.userId === get().currentUserId && msg.recipientId === userId))
            );
          }
          return msg.channel === channel;
        });
      },
    }),
    {
      docId: "family-chat"
    }
  )
);
