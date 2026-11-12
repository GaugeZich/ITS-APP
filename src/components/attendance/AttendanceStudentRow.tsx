import { StyleSheet, Text, View } from 'react-native';
import { AttendanceRecord } from '@/features/attendance/attendance.types';
import { getAttendanceStatusStyles } from '@/components/attendance/attendanceStatusStyles';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    record: AttendanceRecord;
};

// Una fila de solo lectura: alumno, legajo, estado y observación
export function AttendanceStudentRow({ record }: Props) {
    const { colors } = useTheme();
    const statusStyle = getAttendanceStatusStyles(colors)[record.status];

    return (
        <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>
                    {record.student.lastName}, {record.student.firstName}
                </Text>
                <Text style={[styles.detail, { color: colors.muted }]}>
                    Legajo {record.student.studentNumber}
                </Text>
                {record.observation ? (
                    <Text style={[styles.observation, { color: colors.muted }]}>“{record.observation}”</Text>
                ) : null}
            </View>
            <View style={[styles.badge, { backgroundColor: statusStyle.color }]}>
                <Text style={styles.badgeText}>{statusStyle.label}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
    },
    detail: {
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xxxs,
    },
    observation: {
        fontSize: theme.fontSize.sm,
        fontStyle: 'italic',
        marginTop: theme.spacing.xs,
    },
    badge: {
        paddingVertical: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.sm,
    },
    badgeText: {
        color: theme.colors.onAccent,
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
    },
});