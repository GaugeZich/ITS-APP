import { AttendanceTotals } from './student.types';

export type AttendanceSummary = {
    attended: number;
    total: number;
    percent: number | null;
};

/**
 * Regla usada: cuentan como asistencia PRESENT y LATE.
 * ABSENT y JUSTIFIED no suman (la justificada explica la falta, pero no es asistencia).
 * Si el reglamento del ITS dice otra cosa, se cambia solo acá.
 */
export function calculateAttendance(totals: AttendanceTotals): AttendanceSummary {
    const attended = totals.PRESENT + totals.LATE;
    const total = totals.PRESENT + totals.LATE + totals.ABSENT + totals.JUSTIFIED;
    const percent = total > 0 ? Math.round((attended / total) * 100) : null;
    return { attended, total, percent };
}

/** "2026-11-07T00:00:00.000Z" -> "07/11/2026", sin pasar por la zona horaria. */
export function formatClassDate(iso: string): string {
    const [year, month, day] = iso.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}