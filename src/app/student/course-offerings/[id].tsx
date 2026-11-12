import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMyAttendance } from '@/features/student/useMyAttendance';
import { calculateAttendance } from '@/features/attendance/attendance.utils';
import { AttendanceTotalsCard } from '@/components/attendance/AttendanceTotalsCard';
import { AttendancePercentCard } from '@/components/students/AttendancePercentCard';
import { AttendanceRecordRow } from '@/components/students/AttendanceRecordRow';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export default function StudentCourseDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
    const { colors } = useTheme();
    const { history, isLoading, error, reload } = useMyAttendance(id);

    // Más reciente primero, ordenado por la fecha de la clase
    const records = useMemo(
        () =>
            [...(history?.records ?? [])].sort((a, b) =>
                b.classSession.date.localeCompare(a.classSession.date)
            ),
        [history]
    );

    const header = <Stack.Screen options={{ title: name ?? 'Materia' }} />;

    if (isLoading && !history) {
        return (
            <>
                {header}
                <FeedbackState title="Cargando asistencia..." />
            </>
        );
    }

    if (error || !history) {
        return (
            <>
                {header}
                <FeedbackState
                    title="No se pudo cargar tu asistencia"
                    description={error}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            </>
        );
    }

    const summary = calculateAttendance(history.totals);
    const minPercentText = records[0]?.classSession.courseOffering.minAttendancePercent;
    const minPercent = minPercentText ? Number(minPercentText) : null;

    return (
        <Screen>
            {header}
            <FlatList
                data={records}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AttendanceRecordRow record={item} />}
                onRefresh={reload}
                refreshing={isLoading}
                ListHeaderComponent={
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>{name ?? 'Materia'}</Text>
                        <AttendancePercentCard summary={summary} minPercent={minPercent} />
                        <AttendanceTotalsCard totals={history.totals} />
                        {records.length > 0 ? (
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Clases ({records.length})
                            </Text>
                        ) : null}
                    </View>
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: theme.fontSize.title,
        fontWeight: theme.fontWeight.bold,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        marginBottom: theme.spacing.sm,
    },
});