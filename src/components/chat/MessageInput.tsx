'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'voice') => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, onTyping, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onSendMessage(imageUrl, 'image');
      toast.success('Image shared successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to process image');
    };
    reader.readAsDataURL(file);

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB');
      return;
    }

    // For demo purposes, we'll just send the file name and size
    // In a real app, you'd upload to a server and get a URL
    onSendMessage(file.name, 'file');
    toast.success(`File "${file.name}" shared successfully`);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateVoiceMessage = () => {
    // Simulate sending a voice message
    onSendMessage('Voice message (0:32)', 'voice');
    toast.success('Voice message sent');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File upload buttons */}
        <div className="flex space-x-1">
          {/* Image upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
            title="Send image"
          >
            📷
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* File upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
            title="Send file"
          >
            📎
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Voice message */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={simulateVoiceMessage}
            disabled={disabled}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2"
            title="Send voice message"
          >
            🎤
          </Button>
        </div>

        {/* Message input */}
        <div className="flex-1">
          <Input
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={disabled}
            className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as React.FormEvent);
              }
            }}
          />
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-green-600 hover:bg-green-700 text-white px-6"
        >
          Send
        </Button>
      </form>

      {/* Typing indicator */}
      {isTyping && (
        <div className="text-xs text-gray-500 mt-1">
          You are typing...
        </div>
      )}
    </div>
  );
}