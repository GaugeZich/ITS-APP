import { apiRequest } from '@/lib/api/api.client';
import { ApiResponse } from '@/features/courses/courses.types';
import { AttendanceRecord, AttendanceRecordInput, AttendanceStatus, ClassSession } from './attendance.types';

// GET /class-sessions/{id}: una clase (fecha, tema, notas, estado)
export function getClassSession(
    sessionId: string,
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(`/class-sessions/${sessionId}`, { token });
}

// POST: crea (abre) una clase. El backend responde 409 si ya hay una ese día
export function createClassSession(
    courseOfferingId: string,
    body: { date: string; topic: string; notes?: string },
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(
        `/course-offerings/${courseOfferingId}/class-sessions`,
        { method: 'POST', body, token }
    );
}

// POST: guarda la asistencia de todos juntos. La clase tiene que estar abierta
export function markBulkAttendance(
    sessionId: string,
    records: AttendanceRecordInput[],
    token: string
): Promise<ApiResponse<unknown>> {
    return apiRequest<ApiResponse<unknown>>(
        `/class-sessions/${sessionId}/attendance/bulk`,
        { method: 'POST', body: { records }, token }
    );
}

// PATCH: cierra la clase
export function closeClassSession(
    sessionId: string,
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(
        `/class-sessions/${sessionId}/close`,
        { method: 'PATCH', token }
    );
}

// PATCH: reabre la clase
export function reopenClassSession(
    sessionId: string,
    reason: string,
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(`/class-sessions/${sessionId}/reopen`, {
        method: 'PATCH',
        body: { reason },
        token,
    });
}

// GET: todas las clases de una materia
export function getClassSessions(
    courseOfferingId: string,
    token: string
): Promise<ApiResponse<ClassSession[]>> {
    return apiRequest<ApiResponse<ClassSession[]>>(
        `/course-offerings/${courseOfferingId}/class-sessions`,
        { token }
    );
}

// GET: la asistencia guardada de una clase, con los datos de cada alumno
export function getSessionAttendance(
    sessionId: string,
    token: string
): Promise<ApiResponse<AttendanceRecord[]>> {
    return apiRequest<ApiResponse<AttendanceRecord[]>>(
        `/class-sessions/${sessionId}/attendance`,
        { token }
    );
}

// PATCH: corrige un registro. Solo funciona con la clase abierta (por eso existe attendance.corrections.ts)
export function updateAttendanceRecord(
    recordId: string,
    body: { status: AttendanceStatus; observation?: string },
    token: string
): Promise<ApiResponse<AttendanceRecord>> {
    return apiRequest<ApiResponse<AttendanceRecord>>(
        `/attendance/${recordId}`,
        { method: 'PATCH', body, token }
    );
}