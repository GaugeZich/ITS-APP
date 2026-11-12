import { Shift } from '@/features/courses/courses.types';
import { AttendanceStatus, AttendanceTotals } from '@/features/attendance/attendance.types';

export type EnrollmentStatus = 'ACTIVE' | 'DROPPED' | 'COMPLETED' | 'VOID';

export type EnrollmentCondition =
    | 'IN_PROGRESS'
    | 'REGULAR'
    | 'NOT_REGULAR'
    | 'PROMOTED'
    | 'ABANDONED';

// Una inscripción: el alumno en una cursada. courseOffering trae materia, docente y horario
export type StudentEnrollment = {
    id: string;
    courseOfferingId: string;
    status: EnrollmentStatus;
    condition: EnrollmentCondition;
    courseOffering: {
        id: string;
        commission: string;
        shift: Shift;
        dayOfWeek: number | null;
        startTime: string | null;
        endTime: string | null;
        classroom: string | null;
        // Viene como texto ("75"): se convierte con Number() al usarlo
        minAttendancePercent: string;
        subject: {
            id: string;
            name: string;
            code: string;
            year: number;
        };
        academicYear: {
            id: string;
            name: string;
        };
        teacher: {
            id: string;
            firstName: string;
            lastName: string;
        };
    };
};

// Un registro de asistencia del alumno, con la clase a la que pertenece
export type StudentAttendanceRecord = {
    id: string;
    status: AttendanceStatus;
    method: string;
    observation: string | null;
    markedAt: string;
    classSession: {
        id: string;
        date: string;
        topic: string | null;
        status: 'OPEN' | 'CLOSED';
        courseOffering: {
            id: string;
            minAttendancePercent: string;
        };
    };
};

// Respuesta de /students/me/attendance: totales ya calculados + lista de registros
export type StudentAttendanceHistory = {
    totals: AttendanceTotals;
    records: StudentAttendanceRecord[];
};