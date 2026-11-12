import { StyleSheet, Text, View } from 'react-native';
import { AttendanceSummary } from '@/features/attendance/attendance.utils';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    summary: AttendanceSummary;
    minPercent: number | null;
};

export function AttendancePercentCard({ summary, minPercent }: Props) {
    const { colors } = useTheme();

    if (summary.percent === null) {
        return (
            <Text style={[styles.empty, { color: colors.muted }]}>
                Todavía no hay clases con asistencia registrada.
            </Text>
        );
    }

    // Verde si alcanza el mínimo, rojo si no
    const meetsMinimum = minPercent === null || summary.percent >= minPercent;
    const barColor = meetsMinimum ? colors.secondary : colors.danger;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.percent, { color: barColor }]}>{summary.percent}%</Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                Asististe a {summary.attended} de {summary.total} clases
            </Text>

            <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View style={[styles.fill, { width: `${summary.percent}%`, backgroundColor: barColor }]} />
            </View>

            {minPercent !== null ? (
                <Text style={[styles.detail, { color: meetsMinimum ? colors.muted : colors.danger }]}>
                    {meetsMinimum
                        ? `Cumplís el mínimo de ${minPercent}% para regularizar.`
                        : `Estás por debajo del mínimo de ${minPercent}% para regularizar.`}
                </Text>
            ) : null}
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
    percent: {
        fontSize: theme.fontSize.hero,
        fontWeight: theme.fontWeight.extrabold,
    },
    detail: {
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xs,
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
    empty: {
        marginBottom: theme.spacing.md,
    },
});