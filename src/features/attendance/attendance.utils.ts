import { AttendanceStatus, AttendanceTotals } from './attendance.types';

// Resultado del cálculo: a cuántas asistió, de cuántas, y el porcentaje (null si no hay clases).
export type AttendanceSummary = {
    attended: number;
    total: number;
    percent: number | null;
};

// Regla usada: cuentan como asistencia PRESENT y LATE. Mientras que ABSENT y JUSTIFIED no suman
export function calculateAttendance(totals: AttendanceTotals): AttendanceSummary {
    const attended = totals.PRESENT + totals.LATE;
    const total = totals.PRESENT + totals.LATE + totals.ABSENT + totals.JUSTIFIED;
    const percent = total > 0 ? Math.round((attended / total) * 100) : null;
    return { attended, total, percent };
}

// Cuenta cuántos registros hay de cada estado
export function countByStatus(records: { status: AttendanceStatus }[]): AttendanceTotals {
    const totals: AttendanceTotals = { PRESENT: 0, ABSENT: 0, LATE: 0, JUSTIFIED: 0 };
    records.forEach((record) => {
        totals[record.status] += 1;
    });
    return totals;
}

// El profesor puede corregir una clase cerrada hasta el día siguiente de la clase
export function isWithinTeacherEditWindow(classDateIso: string, now: Date = new Date()): boolean {
    const [year, month, day] = classDateIso.slice(0, 10).split('-').map(Number);
    const endOfNextDay = new Date(year, month - 1, day + 1, 23, 59, 59, 999);
    return now.getTime() <= endOfNextDay.getTime();
}

// Formateo de la fecha
export function formatClassDate(iso: string): string {
    const [year, month, day] = iso.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}