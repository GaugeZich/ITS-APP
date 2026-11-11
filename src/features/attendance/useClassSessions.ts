import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { ApiError } from '@/lib/api/api.client';
import { getClassSessions } from './attendance.service';
import { ClassSession } from './attendance.types';

export function useClassSessions(courseOfferingId: string) {
    const { token, signOut } = useSession();
    const [sessions, setSessions] = useState<ClassSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        load();
    }, [courseOfferingId]);

    async function load() {
        if (!token) return;
        try {
            setError('');
            setIsLoading(true);
            const response = await getClassSessions(courseOfferingId, token);
            setSessions(response.data);
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                await signOut();
                return;
            }
            setError('No se pudo cargar el historial de clases');
        } finally {
            setIsLoading(false);
        }
    }

    return { sessions, isLoading, error, reload: load };
}