import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { useMyEnrollments } from '@/features/student/useMyEnrollments';
import { StudentCourseCard } from '@/components/students/StudentCourseCard';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export default function StudentHomeScreen() {
    const router = useRouter();
    const { user } = useSession();
    const { colors } = useTheme();
    const { enrollments, isLoading, error, reload } = useMyEnrollments();

    return (
        // Encabezado arriba y barra de pestañas abajo: ya dejan los márgenes de la zona segura
        <Screen edges={['left', 'right']}>
            <View style={styles.header}>
                <Text style={[styles.greeting, { color: colors.text }]}>
                    Hola, {user?.profile.firstName}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>Mis materias</Text>
            </View>

            {isLoading && enrollments.length === 0 ? (
                <FeedbackState title="Cargando materias..." />
            ) : null}

            {!isLoading && error ? (
                <FeedbackState
                    title="No se pudieron cargar tus materias"
                    description={error}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            ) : null}

            {!isLoading && !error && enrollments.length === 0 ? (
                <FeedbackState title="No estás inscripto en ninguna materia" variant="empty" />
            ) : null}

            {!error && enrollments.length > 0 ? (
                <FlatList
                    data={enrollments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <StudentCourseCard
                            enrollment={item}
                            onPress={() =>
                                router.push({
                                    pathname: '/student/course-offerings/[id]',
                                    params: {
                                        id: item.courseOfferingId,
                                        name: item.courseOffering.subject.name,
                                    },
                                })
                            }
                        />
                    )}
                    onRefresh={reload}
                    refreshing={isLoading}
                />
            ) : null}
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.lg,
    },
    greeting: {
        fontSize: theme.fontSize.md,
        opacity: theme.opacity.soft,
    },
    title: {
        fontSize: theme.fontSize.heading,
        fontWeight: theme.fontWeight.bold,
    },
});