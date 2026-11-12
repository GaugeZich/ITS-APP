import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { login, getMe } from './auth.service';
import { saveSessionToken, getSessionToken, deleteSessionToken } from '@/lib/storage/secure-storage';
import { setUnauthorizedHandler } from '@/lib/api/api.client';
import { isApiError } from '@/lib/api/api.errors';
import { User, LoginCredentials } from './auth.types';

// Lo que el contexto le da a las pantallas.
type SessionContextValue = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => Promise<void>;
};

// Empieza en null, el Provider le da el valor.
export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                const savedToken = await getSessionToken();
                if (!savedToken) return;
                const response = await getMe(savedToken);
                setToken(savedToken);
                setUser(response.data);
            } catch (e) {
                // Solo se borra el token si el backend dice que no sirve (401).
                if (isApiError(e, 401)) await deleteSessionToken();
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, []);

    // Si cualquier petición autenticada recibe 401, se cierra la sesión acá (una sola vez, para toda la app)
    useEffect(() => {
        setUnauthorizedHandler(() => {
            deleteSessionToken();
            setToken(null);
            setUser(null);
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    // Login: guarda el token en SecureStore y el usuario en el estado.
    async function signIn(credentials: LoginCredentials) {
        const response = await login(credentials);
        const { accessToken, user: loggedUser } = response.data;
        await saveSessionToken(accessToken);
        setToken(accessToken);
        setUser(loggedUser);
    }

    // Logout: borra el token. Con user en null, los layouts mandan al login.
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

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}