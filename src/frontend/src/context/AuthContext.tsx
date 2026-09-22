

import { createContext, useContext, useState } from 'react';
import type { ReactNode} from 'react';

// 1. Define the shapes of our data
interface User {
  _id: string;
  email: string;
 tier: 'free'|'pro'|'plus';
  noteCount:number;
  token: string;
}
 
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(()=>{
	const savedUser = localStorage.getItem("user");
	return savedUser? JSON.parse(savedUser):null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save to browser
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear from browser
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
