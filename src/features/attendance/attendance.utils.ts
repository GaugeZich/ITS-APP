import { AttendanceStatus, AttendanceTotals } from './attendance.types';

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

/** Cuenta cuántos registros hay de cada estado (el backend del alumno lo manda hecho; el del docente no). */
export function countByStatus(records: { status: AttendanceStatus }[]): AttendanceTotals {
    const totals: AttendanceTotals = { PRESENT: 0, ABSENT: 0, LATE: 0, JUSTIFIED: 0 };
    records.forEach((record) => {
        totals[record.status] += 1;
    });
    return totals;
}

/**
 * El docente puede corregir una clase cerrada hasta el día siguiente a su fecha (regla del backend).
 * Sirve para avisar antes de intentarlo; la decisión final la toma igual el backend.
 */
export function isWithinTeacherEditWindow(classDateIso: string, now: Date = new Date()): boolean {
    const [year, month, day] = classDateIso.slice(0, 10).split('-').map(Number);
    const endOfNextDay = new Date(year, month - 1, day + 1, 23, 59, 59, 999);
    return now.getTime() <= endOfNextDay.getTime();
}

/** "2026-11-07T00:00:00.000Z" -> "07/11/2026", sin pasar por la zona horaria. */
export function formatClassDate(iso: string): string {
    const [year, month, day] = iso.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}