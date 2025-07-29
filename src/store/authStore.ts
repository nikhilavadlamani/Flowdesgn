import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  username: string;
  email?: string;
  role?: string;
  lastLogin?: Date;
}

export interface RegisteredUser {
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
  role: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  registeredUsers: RegisteredUser[];
}

export interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

// Utility functions for managing registered users
const getRegisteredUsers = (): RegisteredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('drawflow-registered-users');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: RegisteredUser[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('drawflow-registered-users', JSON.stringify(users));
};

// Simulate API call for demonstration
const simulateLogin = async (username: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validation
  if (!username.trim() || !password.trim()) {
    throw new Error('Username and password are required');
  }
  
  // Get registered users
  const registeredUsers = getRegisteredUsers();
  
  // Find user in registered users
  const user = registeredUsers.find(u => 
    u.username.toLowerCase() === username.toLowerCase()
  );
  
  if (!user) {
    throw new Error('User not found. Please sign up first.');
  }
  
  // Check password (in real app, this would be hashed comparison)
  if (user.password !== password) {
    throw new Error('Invalid password. Please try again.');
  }
  
  return {
    username: user.username,
    email: user.email,
    role: user.role,
    lastLogin: new Date(),
  };
};

// Simulate signup API call
const simulateSignup = async (username: string, email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Validation
  if (!username.trim() || !email.trim() || !password.trim()) {
    throw new Error('All fields are required');
  }
  
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  // Get existing registered users
  const registeredUsers = getRegisteredUsers();
  
  // Check if username already exists
  const existingUser = registeredUsers.find(u => 
    u.username.toLowerCase() === username.toLowerCase()
  );
  if (existingUser) {
    throw new Error('Username already exists. Please choose a different username.');
  }
  
  // Check if email already exists
  const existingEmail = registeredUsers.find(u => 
    u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingEmail) {
    throw new Error('Email already registered. Please use a different email or sign in.');
  }
  
  // Create new user
  const newUser: RegisteredUser = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password, // In real app, this would be hashed
    role: 'user',
    createdAt: new Date(),
  };
  
  // Add to registered users and save
  const updatedUsers = [...registeredUsers, newUser];
  saveRegisteredUsers(updatedUsers);
  
  // Return user data for authentication
  return {
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    lastLogin: new Date(),
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      registeredUsers: getRegisteredUsers(),

      // Actions
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await simulateLogin(username, password);
          set({ 
            isAuthenticated: true, 
            user, 
            isLoading: false, 
            error: null 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed',
            isAuthenticated: false,
            user: null
          });
        }
      },

      signup: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await simulateSignup(username, email, password);
          set({ 
            isAuthenticated: true, 
            user, 
            isLoading: false, 
            error: null,
            registeredUsers: getRegisteredUsers() // Refresh the registered users list
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Signup failed',
            isAuthenticated: false,
            user: null
          });
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          error: null,
          isLoading: false
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'drawflow-auth', // localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
