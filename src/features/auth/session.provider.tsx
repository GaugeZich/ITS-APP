import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { login, getMe } from './auth.service';
import { saveSessionToken, getSessionToken, deleteSessionToken } from '@/lib/storage/secure-storage';
import { User, LoginCredentials } from './auth.types';

type SessionContextValue = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        restoreSession();
    }, []);

    async function restoreSession() {
        try {
            const savedToken = await getSessionToken();
            if (!savedToken) {
                setIsLoading(false);
                return;
            }
            const currentUser = await getMe(savedToken);
            setToken(savedToken);
            setUser(currentUser);
        } catch {
            await deleteSessionToken();
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function signIn(credentials: LoginCredentials) {
        const response = await login(credentials);
        const { accessToken, user: loggedUser } = response.data;
        await saveSessionToken(accessToken);
        setToken(accessToken);
        setUser(loggedUser);
    }

    async function signOut() {
        await deleteSessionToken();
        setToken(null);
        setUser(null);
    }

    const value: SessionContextValue = {
        user,
        token,
        isLoading,
        signIn,
        signOut,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}