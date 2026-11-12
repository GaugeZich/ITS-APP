import { apiRequest } from '@/lib/api/api.client';
import { ApiResponse, CourseOffering, EnrolledStudent } from './courses.types';

// GET /teachers/me/course-offerings: materias del docente logueado (lo identifica el token)
export async function getMyCourseOfferings(
    token: string
): Promise<ApiResponse<CourseOffering[]>> {
    return apiRequest<ApiResponse<CourseOffering[]>>(
        '/teachers/me/course-offerings',
        { method: 'GET', token }
    );
}

// GET /course-offerings/{id}/students: alumnos inscriptos en una materia
export async function getCourseStudents(
    courseOfferingId: string,
    token: string
): Promise<ApiResponse<EnrolledStudent[]>> {
    return apiRequest<ApiResponse<EnrolledStudent[]>>(
        `/course-offerings/${courseOfferingId}/students`,
        { method: 'GET', token }
    );
}