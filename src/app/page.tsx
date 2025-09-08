'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatArea from '@/components/chat/ChatArea';
import { useAuth } from '@/hooks/use-auth';
import { useChat } from '@/hooks/use-chat';

export default function ChatApp() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Initialize chat data with user ID
  const { 
    chats, 
    currentChatId, 
    users, 
    isLoading: chatLoading,
    selectChat, 
    sendMessage, 
    setIsTyping, 
    getCurrentChat, 
    getCurrentMessages 
  } = useChat(user?.id || null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToSidebar = () => {
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push('/auth');
  };

  // Show loading state
  if (isLoading || chatLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading ChatApp...</h2>
          <p className="text-gray-600">Please wait while we set up your conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Mobile back button */}
      {isMobile && !showSidebar && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBackToSidebar}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900"
          >
            ← 
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-20' : 'w-80'}
        ${isMobile && !showSidebar ? 'hidden' : 'block'}
        transition-all duration-300
      `}>
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          currentUser={user}
          users={users}
          onChatSelect={handleChatSelect}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1
        ${isMobile && showSidebar ? 'hidden' : 'block'}
      `}>
        <ChatArea
          currentChat={getCurrentChat()}
          messages={getCurrentMessages()}
          currentUser={user}
          users={users}
          onSendMessage={sendMessage}
          onTyping={setIsTyping}
        />
      </div>
    </div>
  );
}