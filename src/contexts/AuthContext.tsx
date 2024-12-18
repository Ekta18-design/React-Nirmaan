// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the context state and actions
interface AuthContextProps {
  user: User | null;
  authToken: string | null;
  login: (values: LoginValues) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Define the type for user and login values
interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface LoginValues {
  email: string;
  password: string;
}

// Create context with a default value to avoid errors
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use the Auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define the type for the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for auth token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      fetchUserProfile(token); // Fetch user profile if token exists
    } else {
      setIsLoading(false); // Set loading to false if no token found
    }
  }, []);

 // Fetch user profile using the stored token
 const fetchUserProfile = async (token: string) => {
  try {
    const response = await fetch('http://localhost:5001/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    setUser(data.user); // Set user with role
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Login function to set the token and user state
  const login = async (values: LoginValues) => {
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Network response was not ok');
      }

      const result = await response.json();
      setAuthToken(result.token);
      setUser(result.user);
      localStorage.setItem('authToken', result.token);
      document.cookie = `authToken=${result.token}; path=/; Secure; SameSite=Strict`;
      navigate('/dashboard'); // Redirect to the dashboard on successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Logout function to clear the token and user state
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
    navigate('/login'); // Redirect to login on logout
  };

  // Check if the user is authenticated
  const isAuthenticated = !!authToken;

  // Display a loader or nothing while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>; // Replace with your preferred loading indicator
  }

  // Provide the auth state and functions to the children
  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
