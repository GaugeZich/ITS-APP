import { StyleSheet, Text, View } from 'react-native';
import { AttendanceStatus, AttendanceTotals } from '@/features/attendance/attendance.types';
import { getAttendanceStatusStyles } from '@/components/attendance/attendanceStatusStyles';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    totals: AttendanceTotals;
};

const ORDER: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED'];

export function AttendanceTotalsCard({ totals }: Props) {
    const { colors } = useTheme();
    const statusStyles = getAttendanceStatusStyles(colors);

    return (
        <View style={styles.row}>
            {ORDER.map((status) => (
                <View
                    key={status}
                    style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                    <Text style={[styles.value, { color: statusStyles[status].color }]}>
                        {totals[status] ?? 0}
                    </Text>
                    <Text style={[styles.label, { color: colors.muted }]}>
                        {statusStyles[status].label}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    box: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.md,
    },
    value: {
        fontSize: theme.fontSize.title,
        fontWeight: theme.fontWeight.extrabold,
    },
    label: {
        fontSize: theme.fontSize.xxs,
        marginTop: theme.spacing.xxxs,
    },
});