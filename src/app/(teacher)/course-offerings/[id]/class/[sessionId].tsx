import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useClassSessionDetail } from '@/features/attendance/useClassSessionDetail';
import {
    calculateAttendance,
    countByStatus,
    formatClassDate,
    isWithinTeacherEditWindow,
} from '@/features/attendance/attendance.utils';
import { AttendanceTotalsCard } from '@/components/attendance/AttendanceTotalsCard';
import { AttendanceStudentRow } from '@/components/attendance/AttendanceStudentRow';
import { ClassAttendanceSummary } from '@/components/attendance/ClassAttendanceSummary';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export default function ClassSessionDetailScreen() {
    const { id, sessionId } = useLocalSearchParams<{ id: string; sessionId: string }>();
    const router = useRouter();
    const { colors } = useTheme();
    const { session, records, isLoading, error, reload } = useClassSessionDetail(sessionId);

    // Orden alfabético por apellido, como una planilla
    const sortedRecords = useMemo(
        () =>
            [...records].sort((a, b) =>
                `${a.student.lastName} ${a.student.firstName}`.localeCompare(
                    `${b.student.lastName} ${b.student.firstName}`
                )
            ),
        [records]
    );
    const totals = useMemo(() => countByStatus(records), [records]);

    const header = <Stack.Screen options={{ title: 'Detalle de clase' }} />;

    if (isLoading && !session) {
        return (
            <>
                {header}
                <FeedbackState title="Cargando clase..." />
            </>
        );
    }

    if (error || !session) {
        return (
            <>
                {header}
                <FeedbackState
                    title="No se pudo cargar la clase"
                    description={error}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            </>
        );
    }

    const isOpen = session.status === 'OPEN';
    const summary = calculateAttendance(totals);
    // Una clase cerrada se puede corregir hasta el día siguiente; después, solo secretaría
    const canEdit = isOpen || isWithinTeacherEditWindow(session.date);

    // Va a la edición. sessionStatus le indica si hay que reabrir la clase.
    function goToEdit() {
        if (!session) return;
        router.push({
            pathname: '/(teacher)/course-offerings/[id]/attendance',
            params: {
                id,
                sessionId: session.id,
                topic: session.topic ?? '',
                date: session.date,
                sessionStatus: session.status,
            },
        });
    }

    return (
        <Screen>
            {header}
            <FlatList
                data={sortedRecords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AttendanceStudentRow record={item} />}
                onRefresh={reload}
                refreshing={isLoading}
                ListHeaderComponent={
                    <View>
                        <View style={styles.titleRow}>
                            <Text style={[styles.date, { color: colors.text }]}>
                                {formatClassDate(session.date)}
                            </Text>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { borderColor: isOpen ? colors.primary : colors.border },
                                ]}
                            >
                                <Text style={[styles.statusText, { color: isOpen ? colors.primary : colors.muted }]}>
                                    {isOpen ? 'Abierta' : 'Cerrada'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.topic, { color: colors.text }]}>{session.topic ?? 'Sin tema'}</Text>
                        {session.notes ? (
                            <Text style={[styles.notes, { color: colors.muted }]}>Notas: {session.notes}</Text>
                        ) : null}

                        {records.length > 0 ? (
                            <>
                                <ClassAttendanceSummary summary={summary} />
                                <AttendanceTotalsCard totals={totals} />
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    Alumnos ({records.length})
                                </Text>
                            </>
                        ) : (
                            <Text style={[styles.notes, { color: colors.muted }]}>
                                Esta clase todavía no tiene asistencia cargada.
                            </Text>
                        )}
                    </View>
                }
                ListFooterComponent={
                    records.length > 0 ? (
                        <View style={styles.footer}>
                            <AppButton
                                title="Editar asistencia"
                                colors={colors}
                                onPress={goToEdit}
                                disabled={!canEdit}
                            />
                            {!canEdit ? (
                                <Text style={[styles.hint, { color: colors.muted }]}>
                                    Pasó el plazo para corregir esta clase (hasta el día siguiente). Si hay un
                                    error, pedile a secretaría que lo corrija.
                                </Text>
                            ) : null}
                        </View>
                    ) : undefined
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: theme.fontSize.title,
        fontWeight: theme.fontWeight.extrabold,
    },
    statusBadge: {
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.sm,
        paddingVertical: theme.spacing.xxxs,
        paddingHorizontal: theme.spacing.sm,
    },
    statusText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
    },
    topic: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        marginTop: theme.spacing.xs,
    },
    notes: {
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        marginBottom: theme.spacing.sm,
    },
    footer: {
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    hint: {
        fontSize: theme.fontSize.xs,
        marginTop: theme.spacing.xs,
        textAlign: 'center',
    },
});