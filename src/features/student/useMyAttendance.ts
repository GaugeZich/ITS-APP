import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getMyAttendance } from './student.service';
import { StudentAttendanceHistory } from './student.types';

export function useMyAttendance(courseOfferingId: string) {
    const { token } = useSession();
    const [history, setHistory] = useState<StudentAttendanceHistory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!token || !courseOfferingId) return;
        let cancelled = false;

        async function load(currentToken: string, offeringId: string) {
            try {
                setIsLoading(true);
                setError('');
                const response = await getMyAttendance(offeringId, currentToken);
                if (!cancelled) setHistory(response.data);
            } catch {
                if (!cancelled) setError('No se pudo cargar tu asistencia');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load(token, courseOfferingId);

        return () => {
            cancelled = true;
        };
    }, [token, courseOfferingId, reloadKey]);

    function reload() {
        setReloadKey((key) => key + 1);
    }

    return { history, isLoading, error, reload };
}