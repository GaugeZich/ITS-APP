import { StyleSheet, Text, View } from 'react-native';
import { EnrolledStudent } from '@/features/courses/courses.types';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    student: EnrolledStudent;
};

export function StudentCard({ student }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.name, { color: colors.text }]}>
                {student.firstName} {student.lastName}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                Legajo {student.studentNumber} · DNI {student.documentNumber}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    name: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
        marginBottom: theme.spacing.xxxs,
    },
    detail: {
        fontSize: theme.fontSize.sm,
    },
});