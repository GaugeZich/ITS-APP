import { apiRequest } from '@/lib/api/api.client';
import { ApiResponse } from '@/features/courses/courses.types';
import { StudentAttendanceHistory, StudentEnrollment } from './student.types';

export function getMyEnrollments(token: string): Promise<ApiResponse<StudentEnrollment[]>> {
    return apiRequest<ApiResponse<StudentEnrollment[]>>('/students/me/enrollments', {
        method: 'GET',
        token,
    });
}

export function getMyAttendance(
    courseOfferingId: string,
    token: string
): Promise<ApiResponse<StudentAttendanceHistory>> {
    return apiRequest<ApiResponse<StudentAttendanceHistory>>(
        `/students/me/attendance?courseOfferingId=${encodeURIComponent(courseOfferingId)}`,
        { method: 'GET', token }
    );
}