'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getChatName, getChatAvatar, getChatParticipant } from '@/lib/chat-data';
import type { Chat, User } from '@/types/chat';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  currentUser: User;
  users: { [userId: string]: User };
  onChatSelect: (chatId: string) => void;
  onSignOut: () => void;
}

export default function ChatSidebar({ 
  chats, 
  currentChatId, 
  currentUser, 
  users,
  onChatSelect, 
  onSignOut 
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => {
    const chatName = getChatName(chat, currentUser.id).toLowerCase();
    return chatName.includes(searchTerm.toLowerCase());
  });

  const getLastMessagePreview = (chat: Chat): string => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const sender = users[chat.lastMessage.senderId];
    const senderName = sender?.id === currentUser.id ? 'You' : sender?.name || 'Unknown';
    
    if (chat.lastMessage.type === 'image') {
      return `${senderName}: 📷 Photo`;
    }
    
    if (chat.lastMessage.type === 'file') {
      return `${senderName}: 📎 ${chat.lastMessage.fileName || 'File'}`;
    }
    
    if (chat.lastMessage.type === 'voice') {
      return `${senderName}: 🎵 Voice message`;
    }
    
    const preview = chat.lastMessage.content.length > 50 
      ? chat.lastMessage.content.substring(0, 50) + '...'
      : chat.lastMessage.content;
    
    return chat.type === 'group' ? `${senderName}: ${preview}` : preview;
  };

  const getMessageTime = (chat: Chat): string => {
    if (!chat.lastMessage) return '';
    
    try {
      return formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: false });
    } catch {
      return '';
    }
  };

  const getTypingIndicator = (chat: Chat): string => {
    if (!chat.isTyping || chat.isTyping.length === 0) return '';
    
    const typingUsers = chat.isTyping
      .filter(userId => userId !== currentUser.id)
      .map(userId => users[userId]?.name || 'Unknown')
      .filter(Boolean);
    
    if (typingUsers.length === 0) return '';
    
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing...`;
    }
    
    return `${typingUsers.length} people are typing...`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="bg-green-700">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{currentUser.name}</h2>
              <p className="text-xs text-green-100 capitalize">{currentUser.status}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSignOut}
            className="text-white hover:bg-green-700 hover:text-white"
          >
            Sign Out
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No conversations found</p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const participant = getChatParticipant(chat, currentUser.id);
              const isOnline = participant?.status === 'online';
              const typingIndicator = getTypingIndicator(chat);

              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${currentChatId === chat.id 
                      ? 'bg-green-50 border border-green-200' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={getChatAvatar(chat, currentUser.id)} />
                      <AvatarFallback>
                        {getChatName(chat, currentUser.id).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.type === 'direct' && isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {getChatName(chat, currentUser.id)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {chat.unreadCount > 0 && (
                          <Badge className="bg-green-600 text-white text-xs">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {getMessageTime(chat)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        typingIndicator 
                          ? 'text-green-600 font-medium' 
                          : chat.unreadCount > 0 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {typingIndicator || getLastMessagePreview(chat)}
                      </p>
                      {chat.lastMessage && (
                        <div className="flex items-center space-x-1 ml-2">
                          {chat.lastMessage.senderId === currentUser.id && (
                            <div className={`text-xs ${
                              chat.lastMessage.status === 'read' ? 'text-blue-500' :
                              chat.lastMessage.status === 'delivered' ? 'text-gray-500' :
                              chat.lastMessage.status === 'sent' ? 'text-gray-400' :
                              'text-gray-300'
                            }`}>
                              {chat.lastMessage.status === 'read' ? '✓✓' :
                               chat.lastMessage.status === 'delivered' ? '✓✓' :
                               chat.lastMessage.status === 'sent' ? '✓' : '⏳'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}