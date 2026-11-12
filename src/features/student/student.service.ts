import { apiRequest } from '@/lib/api/api.client';
import { ApiResponse } from '@/features/courses/courses.types';
import { StudentAttendanceHistory, StudentEnrollment } from './student.types';

// Materias en las que está inscripto (solo las activas)
export function getMyEnrollments(token: string): Promise<ApiResponse<StudentEnrollment[]>> {
    return apiRequest<ApiResponse<StudentEnrollment[]>>('/students/me/enrollments', {
        method: 'GET',
        token,
    });
}

// Asistencia en una materia. ?courseOfferingId filtra; encodeURIComponent hace seguro el valor en la URL
export function getMyAttendance(
    courseOfferingId: string,
    token: string
): Promise<ApiResponse<StudentAttendanceHistory>> {
    return apiRequest<ApiResponse<StudentAttendanceHistory>>(
        `/students/me/attendance?courseOfferingId=${encodeURIComponent(courseOfferingId)}`,
        { method: 'GET', token }
    );
}