import { useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getErrorMessage } from '@/lib/api/api.errors';
import { getCourseStudents } from './courses.service';
import { EnrolledStudent } from './courses.types';

export function useCourseStudents(courseOfferingId: string) {
    const { token } = useSession();
    const [students, setStudents] = useState<EnrolledStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStudents();
    }, [courseOfferingId]);

    async function loadStudents() {
        if (!token) return;

        try {
            setIsLoading(true);
            setError('');
            const response = await getCourseStudents(courseOfferingId, token);
            setStudents(response.data);
        } catch (e) {
            setError(getErrorMessage(e, 'No se pudieron cargar los estudiantes'));
        } finally {
            setIsLoading(false);
        }
    }

    return { students, isLoading, error, reload: loadStudents };
}