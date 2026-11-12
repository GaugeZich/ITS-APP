import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getErrorMessage } from '@/lib/api/api.errors';
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
        // Si la pantalla se cierra antes de que llegue la respuesta, no se actualiza el estado
        let cancelled = false;

        async function load(currentToken: string, offeringId: string) {
            try {
                setIsLoading(true);
                setError('');
                const response = await getMyAttendance(offeringId, currentToken);
                if (!cancelled) setHistory(response.data);
            } catch (e) {
                if (!cancelled) setError(getErrorMessage(e, 'No se pudo cargar tu asistencia'));
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load(token, courseOfferingId);

        return () => {
            cancelled = true;
        };
    }, [token, courseOfferingId, reloadKey]);

    // Cambiar reloadKey vuelve a ejecutar el useEffect
    function reload() {
        setReloadKey((key) => key + 1);
    }

    return { history, isLoading, error, reload };
}