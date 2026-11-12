import { Pressable, StyleSheet, Text } from 'react-native';
import { StudentEnrollment } from '@/features/student/student.types';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type Props = {
    enrollment: StudentEnrollment;
    onPress: () => void;
};

// El backend manda el día como número, por lo que se hace una transformación a texto
const dayLabels: Record<number, string> = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo',
};

// Arma el formato de Día y horas de la cursada
function formatSchedule(offering: StudentEnrollment['courseOffering']): string | null {
    if (!offering.dayOfWeek) return null;
    const day = dayLabels[offering.dayOfWeek] ?? '';
    const hours =
        offering.startTime && offering.endTime
            ? ` ${offering.startTime}–${offering.endTime}`
            : '';
    return `${day}${hours}`;
}

export function StudentCourseCard({ enrollment, onPress }: Props) {
    const { colors } = useTheme();
    const offering = enrollment.courseOffering;
    const schedule = formatSchedule(offering);

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
                {offering.subject.name}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                Comisión {offering.commission} · {offering.subject.year}° año
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
                Docente: {offering.teacher.firstName} {offering.teacher.lastName}
            </Text>
            {schedule ? (
                <Text style={[styles.detail, { color: colors.muted }]}>
                    {schedule}
                    {offering.classroom ? ` · ${offering.classroom}` : ''}
                </Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    pressed: {
        opacity: theme.opacity.soft,
    },
    subjectName: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        marginBottom: theme.spacing.xs,
    },
    detail: {
        fontSize: theme.fontSize.sm,
        marginBottom: theme.spacing.xxxs,
    },
});