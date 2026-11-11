import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CourseOffering } from '@/features/courses/courses.types';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    course: CourseOffering;
    onPress: () => void;
};

const shiftLabels: Record<CourseOffering['shift'], string> = {
    MORNING: 'Mañana',
    AFTERNOON: 'Tarde',
    EVENING: 'Noche',
    VIRTUAL: 'Virtual',
    MIXED: 'Mixto',
};

export function CourseOfferingCard({ course, onPress }: Props) {
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.pressed,
            ]}
        >
            <Text style={[styles.subjectName, { color: colors.text }]}>
                {course.subject.name}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                Comisión {course.commission} · {shiftLabels[course.shift]}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                {course.academicYear.name}
            </Text>
            <Text style={[styles.count, { color: colors.primary }]}>
                {course._count.enrollments} estudiantes inscriptos
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    pressed: {
        opacity: 0.7,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    detail: {
        fontSize: 13,
        marginBottom: 2,
    },
    count: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: theme.spacing.xs,
    },
});