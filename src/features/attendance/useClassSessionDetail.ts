import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { getErrorMessage } from '@/lib/api/api.errors';
import { getClassSession, getSessionAttendance } from './attendance.service';
import { AttendanceRecord, ClassSession } from './attendance.types';

/*
    Datos de una clase pasada: la clase (fecha, tema, notas, estado) y su asistencia.
    Usa useFocusEffect en vez de useEffect: también recarga al volver de
    "Editar asistencia", así el resumen muestra los cambios recién guardados.
*/
export function useClassSessionDetail(sessionId: string) {
    const { token } = useSession();
    const [session, setSession] = useState<ClassSession | null>(null);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            if (!token || !sessionId) return;
            let cancelled = false;

            async function load(currentToken: string) {
                try {
                    setIsLoading(true);
                    setError('');
                    // Las dos peticiones salen a la vez: no dependen una de la otra
                    const [sessionResponse, attendanceResponse] = await Promise.all([
                        getClassSession(sessionId, currentToken),
                        getSessionAttendance(sessionId, currentToken),
                    ]);
                    if (cancelled) return;
                    setSession(sessionResponse.data);
                    setRecords(attendanceResponse.data);
                } catch (e) {
                    if (!cancelled) setError(getErrorMessage(e, 'No se pudo cargar la clase'));
                } finally {
                    if (!cancelled) setIsLoading(false);
                }
            }

            load(token);
            return () => {
                cancelled = true;
            };
        }, [token, sessionId, reloadKey])
    );

    function reload() {
        setReloadKey((key) => key + 1);
    }

    return { session, records, isLoading, error, reload };
}