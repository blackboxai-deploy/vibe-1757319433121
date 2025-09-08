import { User } from '@/types/chat';

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/111b79d5-2569-4cc1-bf81-34d117880571.png',
    status: 'online',
    lastSeen: new Date()
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4e911acb-2d49-4e15-9b49-bc06780c4d88.png',
    status: 'online',
    lastSeen: new Date()
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6fb3f163-f4cf-4c8b-bc2b-0e541277755e.png',
    status: 'away',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/014b0def-3926-4361-a502-6984477efa39.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/48b47df7-cd52-442b-9623-cc252b13d385.png',
    status: 'online',
    lastSeen: new Date()
  }
];

// Mock authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock authentication - any email/password combination works
  const user = mockUsers.find(u => u.email === email) || mockUsers[0];
  
  if (user && password.length >= 6) {
    return user;
  }
  
  return null;
};

export const registerUser = async (name: string, email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    return null; // User already exists
  }
  
  // Validate password length
  if (password.length < 6) {
    return null; // Password too short
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5a6f5083-1277-4e46-a8bc-db69b4b42729.png' ', '+')}`,
    status: 'online',
    lastSeen: new Date()
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const updateUserStatus = (userId: string, status: User['status']): void => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.status = status;
    user.lastSeen = new Date();
    
    // Update current user if it matches
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, status, lastSeen: new Date() });
    }
  }
};