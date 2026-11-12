import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';
import { AttendanceStatus } from '@/features/attendance/attendance.types';

type Props = {
    value: AttendanceStatus;
    onChange: (status: AttendanceStatus) => void;
    disabled?: boolean;
};

export function AttendanceStatusSelector({ value, onChange, disabled }: Props) {
    const { colors } = useTheme();

    const options: { status: AttendanceStatus; label: string; color: string }[] = [
        { status: 'PRESENT', label: 'Presente', color: colors.secondary },
        { status: 'ABSENT', label: 'Ausente', color: colors.danger },
        { status: 'LATE', label: 'Tarde', color: colors.primary },
        { status: 'JUSTIFIED', label: 'Justif.', color: colors.muted },
    ];

    return (
        <View style={[styles.row, disabled && styles.disabled]} pointerEvents={disabled ? 'none' : 'auto'}>
            {options.map((o) => {
                const selected = o.status === value;
                return (
                    <Pressable
                        key={o.status}
                        style={[
                            styles.chip,
                            { borderColor: colors.border },
                            selected && { backgroundColor: o.color, borderColor: o.color },
                        ]}
                        onPress={() => onChange(o.status)}
                    >
                        <Text style={[styles.label, { color: colors.muted }, selected && styles.selectedLabel]}>
                            {o.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.xs, marginTop: theme.spacing.sm },
    disabled: { opacity: theme.opacity.faded },
    chip: { flex: 1, borderWidth: theme.borderWidth.thin, borderRadius: theme.radius.sm, paddingVertical: theme.spacing.xs, alignItems: 'center' },
    label: { fontSize: theme.fontSize.sm },
    selectedLabel: { color: theme.colors.onAccent, fontWeight: theme.fontWeight.bold },
});