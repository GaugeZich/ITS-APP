import { FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useClassSessions } from '@/features/attendance/useClassSessions';
import { ClassSessionCard } from '@/components/attendance/ClassSessionCard';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';

export default function SessionsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors } = useTheme();
    const { sessions, isLoading, error, reload } = useClassSessions(id);

    const header = <Stack.Screen options={{ title: 'Historial de clases' }} />;

    if (isLoading && sessions.length === 0) {
        return <>{header}<FeedbackState title="Cargando clases..." /></>;
    }
    if (error) {
        return (
            <>
                {header}
                <FeedbackState
                    title="No se pudo cargar el historial"
                    description={error}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            </>
        );
    }
    if (sessions.length === 0) {
        return <>{header}<FeedbackState title="Todavía no hay clases registradas" variant="empty" /></>;
    }

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            {header}
            <FlatList
                data={[...sessions].reverse()}
                keyExtractor={(item) => item.id}
                refreshing={isLoading}
                onRefresh={reload}
                renderItem={({ item }) => (
                    <ClassSessionCard
                        session={item}
                        onPress={() =>
                            router.push({
                                pathname: '/(teacher)/course-offerings/[id]/attendance',
                                params: {
                                    id,
                                    sessionId: item.id,
                                    topic: item.topic ?? '',
                                    date: item.date,
                                },
                            })
                        }
                    />
                )}
            />
        </Screen>
    );
}