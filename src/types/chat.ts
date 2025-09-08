export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // For direct messages
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string; // Message ID for replies
  reactions?: Reaction[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  name?: string; // For group chats
  type: 'direct' | 'group';
  participants: string[]; // User IDs
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string; // For group chats
  description?: string;
  isTyping?: string[]; // User IDs of users currently typing
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  messages: { [chatId: string]: Message[] };
  users: { [userId: string]: User };
  isLoading: boolean;
}

export interface TypingIndicator {
  userId: string;
  chatId: string;
  timestamp: Date;
}