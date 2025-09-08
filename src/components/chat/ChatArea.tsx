'use client';

import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { getChatName, getChatAvatar, getChatParticipant } from '@/lib/chat-data';
import type { Chat, Message, User } from '@/types/chat';

interface ChatAreaProps {
  currentChat: Chat | null;
  messages: Message[];
  currentUser: User;
  users: { [userId: string]: User };
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'voice') => void;
  onTyping: (isTyping: boolean) => void;
}

export default function ChatArea({ 
  currentChat, 
  messages, 
  currentUser, 
  users, 
  onSendMessage, 
  onTyping 
}: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to ChatApp</h3>
          <p className="text-gray-600 max-w-sm">
            Select a conversation from the sidebar to start messaging, or create a new conversation to connect with friends and colleagues.
          </p>
        </div>
      </div>
    );
  }

  const participant = getChatParticipant(currentChat, currentUser.id);
  const isOnline = participant?.status === 'online';
  
  const getTypingUsers = () => {
    if (!currentChat.isTyping || currentChat.isTyping.length === 0) return [];
    
    return currentChat.isTyping
      .filter(userId => userId !== currentUser.id)
      .map(userId => users[userId])
      .filter(Boolean);
  };

  const typingUsers = getTypingUsers();

  // Group messages by date for date separators
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [date: string]: Message[] });

  const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) return 'Today';
    if (dateString === yesterday) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={getChatAvatar(currentChat, currentUser.id)} />
              <AvatarFallback>
                {getChatName(currentChat, currentUser.id).split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {currentChat.type === 'direct' && isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              {getChatName(currentChat, currentUser.id)}
            </h2>
            <div className="text-sm text-gray-500">
              {currentChat.type === 'group' ? (
                <span>{currentChat.participants.length} members</span>
              ) : (
                <span className="capitalize">
                  {participant?.status === 'online' ? 'Online' : 
                   participant?.status === 'away' ? 'Away' : 
                   participant?.lastSeen ? `Last seen ${new Date(participant.lastSeen).toLocaleTimeString()}` : 
                   'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-4 space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDateSeparator(date)}
                  </div>
                </div>

                {/* Messages for this date */}
                {(dateMessages as Message[]).map((message, index) => {
                  const sender = users[message.senderId];
                  const isOwn = message.senderId === currentUser.id;
                  const prevMessage = index > 0 ? (dateMessages as Message[])[index - 1] : null;
                  const showAvatar = !isOwn && (
                    !prevMessage || 
                    prevMessage.senderId !== message.senderId ||
                    new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000 // 5 minutes
                  );

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      sender={sender}
                      isOwn={isOwn}
                      isGroupChat={currentChat.type === 'group'}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              </div>
            ))}

            {/* Typing indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={typingUsers[0].avatar} />
                  <AvatarFallback className="text-xs">
                    {typingUsers[0].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        disabled={false}
      />
    </div>
  );
}