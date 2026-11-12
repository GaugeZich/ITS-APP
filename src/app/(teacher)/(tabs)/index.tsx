import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { useTeacherCourses } from '@/features/courses/useTeacherCourses';
import { CourseOfferingCard } from '@/components/courses/CourseOfferingCard';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export default function TeacherHomeScreen() {
    const router = useRouter();
    const { user } = useSession();
    const { colors } = useTheme();
    const { courses, isLoading, error, reload } = useTeacherCourses();

    return (
        // Encabezado arriba y barra de pestañas abajo: ya dejan los márgenes de la zona segura
        <Screen style={{ backgroundColor: colors.background }} edges={['left', 'right']}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.text }]}>
                        Hola, {user?.profile.firstName}
                    </Text>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Mis materias
                    </Text>
                </View>
            </View>

            {isLoading && <FeedbackState title="Cargando materias..." />}

            {!isLoading && error ? (
                <FeedbackState
                    title="Error"
                    description={error}
                    variant="error"
                />
            ) : null}

            {!isLoading && !error && courses.length === 0 ? (
                <FeedbackState title="No tenés materias asignadas" />
            ) : null}

            {!isLoading && !error && courses.length > 0 ? (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CourseOfferingCard
                            course={item}
                            onPress={() =>
                                router.push({
                                    pathname: '/(teacher)/course-offerings/[id]',
                                    params: { id: item.id, name: item.subject.name },
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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