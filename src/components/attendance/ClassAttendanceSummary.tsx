import { StyleSheet, Text, View } from 'react-native';
import { AttendanceSummary } from '@/features/attendance/attendance.utils';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    summary: AttendanceSummary;
};

/** Porcentaje de asistencia de UNA clase (cuántos alumnos vinieron). */
export function ClassAttendanceSummary({ summary }: Props) {
    const { colors } = useTheme();

    if (summary.percent === null) return null;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.row}>
                <Text style={[styles.percent, { color: colors.primary }]}>{summary.percent}%</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>
                    asistieron {summary.attended} de {summary.total} alumnos
                </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View
                    style={[styles.fill, { width: `${summary.percent}%`, backgroundColor: colors.primary }]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.sm,
    },
    percent: {
        fontSize: theme.fontSize.display,
        fontWeight: theme.fontWeight.extrabold,
    },
    detail: {
        fontSize: theme.fontSize.md,
    },
    track: {
        height: theme.sizes.progressBar,
        borderRadius: theme.radius.xs,
        overflow: 'hidden',
        marginTop: theme.spacing.sm,
    },
    fill: {
        height: '100%',
        borderRadius: theme.radius.xs,
    },
});