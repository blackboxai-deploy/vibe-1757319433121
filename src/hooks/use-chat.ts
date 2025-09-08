'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, ChatState, User } from '@/types/chat';
import { mockChats, mockMessages, addMessage, markMessagesAsRead, setTypingIndicator } from '@/lib/chat-data';
import { mockUsers } from '@/lib/auth';

export const useChat = (currentUserId: string | null) => {
  const [chatState, setChatState] = useState<ChatState>({
    chats: [],
    currentChatId: null,
    messages: {},
    users: {},
    isLoading: true
  });

  // Initialize chat data
  useEffect(() => {
    if (!currentUserId) return;

    // Filter chats that include the current user
    const userChats = mockChats.filter(chat => 
      chat.participants.includes(currentUserId)
    );

    // Create users lookup
    const usersLookup: { [userId: string]: User } = {};
    mockUsers.forEach(user => {
      usersLookup[user.id] = user;
    });

    setChatState({
      chats: userChats.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
      currentChatId: userChats.length > 0 ? userChats[0].id : null,
      messages: { ...mockMessages },
      users: usersLookup,
      isLoading: false
    });
  }, [currentUserId]);

  const selectChat = useCallback((chatId: string) => {
    setChatState(prev => ({
      ...prev,
      currentChatId: chatId
    }));

    // Mark messages as read when selecting a chat
    if (currentUserId) {
      markMessagesAsRead(chatId, currentUserId);
      setChatState(prev => ({
        ...prev,
        chats: prev.chats.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      }));
    }
  }, [currentUserId]);

  const sendMessage = useCallback((content: string, type: Message['type'] = 'text') => {
    if (!currentUserId || !chatState.currentChatId) return;

    const newMessage = addMessage(chatState.currentChatId, {
      senderId: currentUserId,
      chatId: chatState.currentChatId,
      content,
      type,
      status: 'sending'
    });

    // Update local state
    setChatState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatState.currentChatId!]: [
          ...(prev.messages[chatState.currentChatId!] || []),
          newMessage
        ]
      },
      chats: prev.chats.map(chat =>
        chat.id === chatState.currentChatId
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
          : chat
      ).sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }));

    // Simulate message status updates
    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatState.currentChatId!]: prev.messages[chatState.currentChatId!]?.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          ) || []
        }
      }));
    }, 1000);

    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatState.currentChatId!]: prev.messages[chatState.currentChatId!]?.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ) || []
        }
      }));
    }, 2000);
  }, [currentUserId, chatState.currentChatId]);

  const setIsTyping = useCallback((isTyping: boolean) => {
    if (!currentUserId || !chatState.currentChatId) return;

    setTypingIndicator(chatState.currentChatId, currentUserId, isTyping);
    
    // Update local state
    setChatState(prev => ({
      ...prev,
      chats: prev.chats.map(chat =>
        chat.id === chatState.currentChatId
          ? {
              ...chat,
              isTyping: isTyping
                ? [...(chat.isTyping || []), currentUserId]
                : (chat.isTyping || []).filter(id => id !== currentUserId)
            }
          : chat
      )
    }));
  }, [currentUserId, chatState.currentChatId]);

  const getCurrentChat = useCallback(() => {
    if (!chatState.currentChatId) return null;
    return chatState.chats.find(chat => chat.id === chatState.currentChatId) || null;
  }, [chatState.chats, chatState.currentChatId]);

  const getCurrentMessages = useCallback(() => {
    if (!chatState.currentChatId) return [];
    return chatState.messages[chatState.currentChatId] || [];
  }, [chatState.messages, chatState.currentChatId]);

  const getUser = useCallback((userId: string) => {
    return chatState.users[userId] || null;
  }, [chatState.users]);

  // Simulate random typing indicators from other users
  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentUserId || chatState.chats.length === 0) return;

      // Randomly show typing indicators
      const randomChat = chatState.chats[Math.floor(Math.random() * chatState.chats.length)];
      const otherParticipants = randomChat.participants.filter(id => id !== currentUserId);
      
      if (otherParticipants.length > 0 && Math.random() < 0.1) { // 10% chance
        const randomUser = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        
        // Start typing
        setTypingIndicator(randomChat.id, randomUser, true);
        setChatState(prev => ({
          ...prev,
          chats: prev.chats.map(chat =>
            chat.id === randomChat.id
              ? {
                  ...chat,
                  isTyping: [...(chat.isTyping || []), randomUser]
                }
              : chat
          )
        }));

        // Stop typing after 2-5 seconds
        setTimeout(() => {
          setTypingIndicator(randomChat.id, randomUser, false);
          setChatState(prev => ({
            ...prev,
            chats: prev.chats.map(chat =>
              chat.id === randomChat.id
                ? {
                    ...chat,
                    isTyping: (chat.isTyping || []).filter(id => id !== randomUser)
                  }
                : chat
            )
          }));
        }, Math.random() * 3000 + 2000);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [currentUserId, chatState.chats]);

  return {
    ...chatState,
    selectChat,
    sendMessage,
    setIsTyping,
    getCurrentChat,
    getCurrentMessages,
    getUser
  };
};