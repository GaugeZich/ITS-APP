import { isApiError } from '@/lib/api/api.errors';
import { closeClassSession, reopenClassSession, updateAttendanceRecord } from './attendance.service';
import { AttendanceStatus, ClassSession } from './attendance.types';

export type AttendanceChange = {
    recordId: string;
    status: AttendanceStatus;
};

/**
 * Guarda correcciones de asistencia de una clase.
 * El backend solo acepta correcciones con la clase abierta, así que si estaba cerrada:
 * la reabre, corrige y la vuelve a cerrar. Si algo falla, intenta dejarla cerrada como estaba.
 */
export async function saveAttendanceCorrections(
    sessionId: string,
    sessionStatus: ClassSession['status'] | undefined,
    changes: AttendanceChange[],
    token: string
): Promise<void> {
    let reopened = false;

    if (sessionStatus !== 'OPEN') {
        try {
            await reopenClassSession(sessionId, 'Corrección de asistencia desde la app', token);
            reopened = true;
        } catch (e) {
            // 409 = ya estaba abierta: se corrige sin reabrir
            if (!isApiError(e, 409)) throw e;
        }
    }

    try {
        // Sin `observation`: así no se borran las observaciones que ya tenían
        await Promise.all(changes.map((c) => updateAttendanceRecord(c.recordId, { status: c.status }, token)));
    } catch (e) {
        if (reopened) await closeClassSession(sessionId, token).catch(() => undefined);
        throw e;
    }

    if (reopened) await closeClassSession(sessionId, token);
}