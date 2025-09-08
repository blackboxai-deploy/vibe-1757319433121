'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, format } from 'date-fns';
import type { Message, User } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  sender: User | null;
  isOwn: boolean;
  isGroupChat: boolean;
  showAvatar: boolean;
}

export default function MessageBubble({ 
  message, 
  sender, 
  isOwn, 
  isGroupChat, 
  showAvatar 
}: MessageBubbleProps) {
  const getMessageStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case 'sending':
        return <span className="text-gray-300 text-xs">⏳</span>;
      case 'sent':
        return <span className="text-gray-400 text-xs">✓</span>;
      case 'delivered':
        return <span className="text-gray-500 text-xs">✓✓</span>;
      case 'read':
        return <span className="text-blue-500 text-xs">✓✓</span>;
      default:
        return null;
    }
  };

  const formatTime = (timestamp: Date) => {
    try {
      const now = new Date();
      const msgDate = new Date(timestamp);
      
      // If message is from today, show time only
      if (msgDate.toDateString() === now.toDateString()) {
        return format(msgDate, 'HH:mm');
      }
      
      // If message is from yesterday, show "Yesterday"
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (msgDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // If message is from this week, show day name
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (msgDate > weekAgo) {
        return format(msgDate, 'EEE');
      }
      
      // Otherwise show date
      return format(msgDate, 'MMM dd');
    } catch {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={message.content}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cf25d502-58d3-4554-a123-bc02d8302a58.png';
              }}
            />
            {message.content && message.content !== message.fileUrl && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className={`
            flex items-center space-x-3 p-3 rounded-lg border
            ${isOwn ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}
          `}>
            <div className="text-2xl">📎</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {message.fileName || 'Unknown file'}
              </p>
              {message.fileSize && (
                <p className="text-xs text-gray-500">
                  {(message.fileSize / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className={`
            flex items-center space-x-3 p-3 rounded-lg
            ${isOwn ? 'bg-green-100' : 'bg-gray-100'}
          `}>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">▶</span>
            </div>
            <div className="flex-1">
              <div className="flex space-x-1">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-green-500 rounded-full ${
                      i % 3 === 0 ? 'h-6' : i % 2 === 0 ? 'h-4' : 'h-3'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">0:32</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {!isOwn && isGroupChat && showAvatar ? (
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender?.avatar} />
          <AvatarFallback className="text-xs">
            {sender?.name?.split(' ').map(n => n[0]).join('') || '?'}
          </AvatarFallback>
        </Avatar>
      ) : (
        !isOwn && isGroupChat && <div className="w-8" />
      )}

      {/* Message bubble */}
      <div className={`
        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
        ${isOwn 
          ? 'bg-green-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }
      `}>
        {/* Sender name for group chats */}
        {!isOwn && isGroupChat && showAvatar && (
          <p className="text-xs font-medium text-gray-600 mb-1">
            {sender?.name || 'Unknown'}
          </p>
        )}

        {/* Message content */}
        <div className="text-sm">
          {renderMessageContent()}
        </div>

        {/* Time and status */}
        <div className={`
          flex items-center justify-end space-x-1 mt-1
          ${isOwn ? 'text-green-100' : 'text-gray-500'}
        `}>
          <span className="text-xs">
            {formatTime(message.timestamp)}
          </span>
          {getMessageStatusIcon()}
        </div>
      </div>
    </div>
  );
}