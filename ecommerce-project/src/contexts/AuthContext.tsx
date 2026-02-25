/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from '../api/axiosConfig';
import type { AxiosError } from 'axios';


interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                await fetchUser();
            } catch {
                localStorage.clear();
                setLoading(false);
            }
        };

        initAuth();
    }, []);


    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/user/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login/', {
                username,
                password
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            await fetchUser();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            await axios.post('/api/auth/register/', userData);
            await login(userData.username, userData.password);

        } catch (error: unknown) {

            if (error && typeof error === 'object') {
                const err = error as AxiosError<{ [key: string]: unknown }>;

                if (err.response?.data) {
                    throw err.response.data;
                }
            }

            throw new Error('Registration failed. Please try again.');
        }
    };


    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                await axios.post('/api/auth/logout/', {
                    refresh_token: refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            localStorage.clear();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { useAuth };
