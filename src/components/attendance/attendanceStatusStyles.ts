import { theme } from '@/constants/theme';
import { AttendanceStatus } from '@/features/attendance/attendance.types';

type ThemeColors = typeof theme.colors.light;

export type AttendanceStatusStyle = {
    label: string;
    color: string;
};

// Etiqueta y color de cada estado, iguales en la vista del docente y del alumno
export function getAttendanceStatusStyles(
    colors: ThemeColors
): Record<AttendanceStatus, AttendanceStatusStyle> {
    return {
        PRESENT: { label: 'Presente', color: colors.secondary },
        ABSENT: { label: 'Ausente', color: colors.danger },
        LATE: { label: 'Tarde', color: colors.primary },
        JUSTIFIED: { label: 'Justificada', color: colors.muted },
    };
}