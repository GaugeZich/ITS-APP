import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useClassSessions } from '@/features/attendance/useClassSessions';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';
import { ClassSession } from '@/features/attendance/attendance.types';




function formatDate(iso: string) {
    const [y, m, d] = iso.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
}

export default function CourseDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
    const router = useRouter();
    const { colors } = useTheme();
    const { sessions, isLoading, error, reload } = useClassSessions(id);

    const recentSessions = useMemo(
        () => [...sessions].reverse().slice(0, 3),
        [sessions]
    );

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            <Stack.Screen options={{ title: name ?? 'Materia' }} />
            <View style={styles.header}>
                <Text style={[styles.subjectName, { color: colors.text }]} numberOfLines={2}>
                    {name ?? 'Materia'}
                </Text>
                <AppButton
                    title="+ Nueva clase"
                    colors={colors}
                    onPress={() => router.push(`/(teacher)/course-offerings/${id}/attendance`)}
                />
                <AppButton
                    title="Escanear QR"
                    colors={colors}
                    variant="secondary"
                    onPress={() => router.push(`/(teacher)/course-offerings/${id}/qr-scanner`)}
                />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Últimas clases
            </Text>

            {isLoading && sessions.length === 0 ? (
                <FeedbackState title="Cargando clases..." />
            ) : null}

            {!isLoading && error ? (
                <FeedbackState
                    title="No se pudo cargar el historial"
                    description={error}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            ) : null}

            {!isLoading && !error && recentSessions.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                    Todavía no hay clases registradas.
                </Text>
            ) : null}

            {!isLoading && !error && recentSessions.length > 0 ? (
                <>
                    <FlatList
                        data={recentSessions}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <ClassPreviewRow
                                session={item}
                                number={sessions.length - index}
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

                    {sessions.length > 3 ? (
                        <Pressable
                            onPress={() => router.push(`/(teacher)/course-offerings/${id}/sessions`)}
                            style={styles.seeMore}
                        >
                            <Text style={[styles.seeMoreText, { color: colors.primary }]}>
                                Ver más
                            </Text>
                        </Pressable>
                    ) : null}
                </>
            ) : null}

            <View style={styles.footer}>
                <AppButton
                    title="Ver estudiantes"
                    colors={colors}
                    variant="secondary"
                    onPress={() => router.push(`/(teacher)/course-offerings/${id}/students`)}
                />
            </View>
        </Screen>
    );
}

function ClassPreviewRow({
    session,
    number,
    onPress,
}: {
    session: ClassSession;
    number: number;
    onPress: () => void;
}) {
    const { colors } = useTheme();
    return (
        <Pressable
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
                Clase {number}: {session.topic ?? 'Sin tema'}
            </Text>
            <Text style={[styles.cardDate, { color: colors.muted }]}>
                Fecha: {formatDate(session.date)}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    subjectName: {
        fontSize: 22,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    card: {
        borderWidth: 1,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 13,
    },
    emptyText: {
        fontSize: 14,
        marginBottom: theme.spacing.md,
    },
    seeMore: {
        alignSelf: 'center',
        marginTop: -theme.spacing.xs,
        marginBottom: 32,
    },
    seeMoreText: {
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: 'auto',
    },
});