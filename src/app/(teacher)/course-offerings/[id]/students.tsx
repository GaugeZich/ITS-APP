import { FlatList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCourseStudents } from '@/features/courses/useCourseStudents';
import { StudentCard } from '@/components/students/StudentCard';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';

export default function CourseStudentsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { students, isLoading, error } = useCourseStudents(id);

    const header = <Stack.Screen options={{ title: 'Estudiantes' }} />;

    if (isLoading) return <>{header}<FeedbackState title="Cargando estudiantes..." /></>;
    if (error) return <>{header}<FeedbackState title="Error" description={error} variant="error" /></>;
    if (students.length === 0) return <>{header}<FeedbackState title="Sin estudiantes inscriptos" /></>;

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            {header}
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StudentCard student={item} />}
            />
        </Screen>
    );
}