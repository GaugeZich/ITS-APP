import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getErrorMessage, isApiError } from '@/lib/api/api.errors';
import { getClassSessions } from './attendance.service';
import { ClassSession } from './attendance.types';

export function useClassSessions(courseOfferingId: string) {
    const { token } = useSession();
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
            // 401: la sesión ya se cerró sola (api.client)
            if (isApiError(e, 401)) return;
            setError(getErrorMessage(e, 'No se pudo cargar el historial de clases'));
        } finally {
            setIsLoading(false);
        }
    }

    return { sessions, isLoading, error, reload: load };
}