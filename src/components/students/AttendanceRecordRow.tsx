import { StyleSheet, Text, View } from 'react-native';
import { StudentAttendanceRecord } from '@/features/student/student.types';
import { formatClassDate } from '@/features/attendance/attendance.utils';
import { getAttendanceStatusStyles } from '@/components/attendance/attendanceStatusStyles';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    record: StudentAttendanceRecord;
};

export function AttendanceRecordRow({ record }: Props) {
    const { colors } = useTheme();
    const statusStyle = getAttendanceStatusStyles(colors)[record.status];

    return (
        <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.info}>
                <Text style={[styles.date, { color: colors.text }]}>
                    {formatClassDate(record.classSession.date)}
                </Text>
                <Text style={[styles.topic, { color: colors.muted }]} numberOfLines={2}>
                    {record.classSession.topic ?? 'Sin tema'}
                </Text>
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
    date: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
    },
    topic: {
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xxxs,
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