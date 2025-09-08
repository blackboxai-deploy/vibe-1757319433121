import { Chat, Message, User } from '@/types/chat';
import { mockUsers } from './auth';

// Mock chat data
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'direct',
    participants: ['1', '2'], // John and Sarah
    unreadCount: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    isTyping: []
  },
  {
    id: 'chat-2',
    type: 'direct',
    participants: ['1', '3'], // John and Mike
    unreadCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isTyping: []
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Project Team',
    participants: ['1', '2', '3', '4'], // John, Sarah, Mike, Emily
    unreadCount: 1,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/78c1b1e8-87d1-4f00-a1ef-46208205ed40.png',
    description: 'Main project discussion group',
    isTyping: []
  },
  {
    id: 'chat-4',
    type: 'direct',
    participants: ['1', '4'], // John and Emily
    unreadCount: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isTyping: []
  },
  {
    id: 'chat-5',
    type: 'direct',
    participants: ['1', '5'], // John and David
    unreadCount: 3,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isTyping: ['5'] // David is typing
  }
];

// Mock messages for each chat
export const mockMessages: { [chatId: string]: Message[] } = {
  'chat-1': [
    {
      id: 'msg-1-1',
      senderId: '2',
      chatId: 'chat-1',
      content: 'Hey John! How are you doing?',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'read'
    },
    {
      id: 'msg-1-2',
      senderId: '1',
      chatId: 'chat-1',
      content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
      type: 'text',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
      status: 'read'
    },
    {
      id: 'msg-1-3',
      senderId: '2',
      chatId: 'chat-1',
      content: 'I\'m good too! Working on that new project we discussed.',
      type: 'text',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'read'
    },
    {
      id: 'msg-1-4',
      senderId: '2',
      chatId: 'chat-1',
      content: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f7deea67-b456-4cf6-abf0-1174212cba02.png',
      type: 'image',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'delivered'
    },
    {
      id: 'msg-1-5',
      senderId: '2',
      chatId: 'chat-1',
      content: 'What do you think about this design?',
      type: 'text',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      status: 'sent'
    }
  ],
  'chat-2': [
    {
      id: 'msg-2-1',
      senderId: '3',
      chatId: 'chat-2',
      content: 'John, can we schedule a meeting for tomorrow?',
      type: 'text',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: 'read'
    },
    {
      id: 'msg-2-2',
      senderId: '1',
      chatId: 'chat-2',
      content: 'Sure! What time works for you?',
      type: 'text',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
      status: 'read'
    },
    {
      id: 'msg-2-3',
      senderId: '3',
      chatId: 'chat-2',
      content: 'How about 2 PM?',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'read'
    }
  ],
  'chat-3': [
    {
      id: 'msg-3-1',
      senderId: '2',
      chatId: 'chat-3',
      content: 'Good morning team! Let\'s discuss today\'s priorities.',
      type: 'text',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'read'
    },
    {
      id: 'msg-3-2',
      senderId: '3',
      chatId: 'chat-3',
      content: 'I\'ll focus on the backend APIs today.',
      type: 'text',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
      status: 'read'
    },
    {
      id: 'msg-3-3',
      senderId: '4',
      chatId: 'chat-3',
      content: 'I\'ll work on the UI components.',
      type: 'text',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: 'read'
    },
    {
      id: 'msg-3-4',
      senderId: '1',
      chatId: 'chat-3',
      content: 'Perfect! I\'ll review the requirements document.',
      type: 'text',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'read'
    },
    {
      id: 'msg-3-5',
      senderId: '2',
      chatId: 'chat-3',
      content: 'Great! Let\'s sync up at lunch.',
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'delivered'
    }
  ],
  'chat-4': [
    {
      id: 'msg-4-1',
      senderId: '4',
      chatId: 'chat-4',
      content: 'Hi John! Hope you\'re having a great week.',
      type: 'text',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
      status: 'read'
    },
    {
      id: 'msg-4-2',
      senderId: '1',
      chatId: 'chat-4',
      content: 'Thanks Emily! You too. How\'s the new project going?',
      type: 'text',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'read'
    }
  ],
  'chat-5': [
    {
      id: 'msg-5-1',
      senderId: '5',
      chatId: 'chat-5',
      content: 'John, I need to discuss the quarterly reports with you.',
      type: 'text',
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      status: 'delivered'
    },
    {
      id: 'msg-5-2',
      senderId: '5',
      chatId: 'chat-5',
      content: 'When would be a good time for you?',
      type: 'text',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'delivered'
    },
    {
      id: 'msg-5-3',
      senderId: '5',
      chatId: 'chat-5',
      content: 'It\'s quite urgent.',
      type: 'text',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'sent'
    }
  ]
};

// Add last messages to chats
mockChats.forEach(chat => {
  const messages = mockMessages[chat.id] || [];
  if (messages.length > 0) {
    chat.lastMessage = messages[messages.length - 1];
  }
});

// Helper functions
export const getChatParticipant = (chat: Chat, currentUserId: string): User | null => {
  if (chat.type === 'group') return null;
  
  const participantId = chat.participants.find(id => id !== currentUserId);
  return mockUsers.find(user => user.id === participantId) || null;
};

export const getChatName = (chat: Chat, currentUserId: string): string => {
  if (chat.type === 'group') {
    return chat.name || 'Group Chat';
  }
  
  const participant = getChatParticipant(chat, currentUserId);
  return participant?.name || 'Unknown User';
};

export const getChatAvatar = (chat: Chat, currentUserId: string): string => {
  if (chat.type === 'group') {
    return chat.avatar || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6d30bc9d-3170-4620-8a9a-c7cc8b2167d6.png';
  }
  
  const participant = getChatParticipant(chat, currentUserId);
  return participant?.avatar || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a8fead57-fac9-45b3-9cbe-d995e1cef5f2.png';
};

export const addMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date(),
    status: 'sending'
  };
  
  if (!mockMessages[chatId]) {
    mockMessages[chatId] = [];
  }
  
  mockMessages[chatId].push(newMessage);
  
  // Update chat's last message and timestamp
  const chat = mockChats.find(c => c.id === chatId);
  if (chat) {
    chat.lastMessage = newMessage;
    chat.updatedAt = new Date();
  }
  
  // Simulate message status updates
  setTimeout(() => {
    newMessage.status = 'sent';
  }, 1000);
  
  setTimeout(() => {
    newMessage.status = 'delivered';
  }, 2000);
  
  return newMessage;
};

export const markMessagesAsRead = (chatId: string, userId: string): void => {
  const messages = mockMessages[chatId] || [];
  messages.forEach(message => {
    if (message.senderId !== userId && message.status !== 'read') {
      message.status = 'read';
    }
  });
  
  // Reset unread count
  const chat = mockChats.find(c => c.id === chatId);
  if (chat) {
    chat.unreadCount = 0;
  }
};

export const setTypingIndicator = (chatId: string, userId: string, isTyping: boolean): void => {
  const chat = mockChats.find(c => c.id === chatId);
  if (!chat) return;
  
  if (isTyping) {
    if (!chat.isTyping?.includes(userId)) {
      chat.isTyping = [...(chat.isTyping || []), userId];
    }
  } else {
    chat.isTyping = (chat.isTyping || []).filter(id => id !== userId);
  }
};