import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getErrorMessage } from '@/lib/api/api.errors';
import { getMyCourseOfferings } from './courses.service';
import { CourseOffering } from './courses.types';

export function useTeacherCourses() {
    const { token } = useSession();
    const [courses, setCourses] = useState<CourseOffering[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Carga las materias al abrir la pantalla
    useEffect(() => {
        loadCourses();
    }, []);

    // Si falla, getErrorMessage arma el mensaje para mostrar
    async function loadCourses() {
        if (!token) return;

        try {
            setIsLoading(true);
            setError('');
            const response = await getMyCourseOfferings(token);
            setCourses(response.data);
        } catch (e) {
            setError(getErrorMessage(e, 'No se pudieron cargar las materias'));
        } finally {
            setIsLoading(false);
        }
    }

    return { courses, isLoading, error, reload: loadCourses };
}