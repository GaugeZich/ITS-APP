import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getMyEnrollments } from './student.service';
import { StudentEnrollment } from './student.types';

export function useMyEnrollments() {
    const { token } = useSession();
    const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        async function load(currentToken: string) {
            try {
                setIsLoading(true);
                setError('');
                const response = await getMyEnrollments(currentToken);
                if (!cancelled) setEnrollments(response.data);
            } catch {
                if (!cancelled) setError('No se pudieron cargar tus materias');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load(token);

        return () => {
            cancelled = true;
        };
    }, [token, reloadKey]);

    function reload() {
        setReloadKey((key) => key + 1);
    }

    return { enrollments, isLoading, error, reload };
}