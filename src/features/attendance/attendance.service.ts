import { apiRequest } from '@/lib/api/api.client';
import { ApiResponse } from '@/features/courses/courses.types';
import { AttendanceRecord, AttendanceRecordInput, AttendanceStatus, ClassSession } from './attendance.types';

export function getClassSession(
    sessionId: string,
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(`/class-sessions/${sessionId}`, { token });
}

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

export function closeClassSession(
    sessionId: string,
    token: string
): Promise<ApiResponse<ClassSession>> {
    return apiRequest<ApiResponse<ClassSession>>(
        `/class-sessions/${sessionId}/close`,
        { method: 'PATCH', token }
    );
}

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

export function getClassSessions(
    courseOfferingId: string,
    token: string
): Promise<ApiResponse<ClassSession[]>> {
    return apiRequest<ApiResponse<ClassSession[]>>(
        `/course-offerings/${courseOfferingId}/class-sessions`,
        { token }
    );
}

export function getSessionAttendance(
    sessionId: string,
    token: string
): Promise<ApiResponse<AttendanceRecord[]>> {
    return apiRequest<ApiResponse<AttendanceRecord[]>>(
        `/class-sessions/${sessionId}/attendance`,
        { token }
    );
}

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