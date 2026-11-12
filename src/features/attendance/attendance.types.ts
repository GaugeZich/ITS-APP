// Los 4 estados que acepta el backend.
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';

// Un número por estado, por ejemplo { PRESENT: 5, ABSENT: 1, LATE: 0, JUSTIFIED: 0 }.
export type AttendanceTotals = Record<AttendanceStatus, number>;

// Una clase en una fecha. OPEN mientras se toma asistencia; CLOSED al terminar.
export type ClassSession = {
    id: string;
    courseOfferingId: string;
    date: string;
    topic: string | null;
    notes: string | null;
    status: 'OPEN' | 'CLOSED';
};

// Lo que se manda al guardar la asistencia de un alumno.
export type AttendanceRecordInput = {
    studentId: string;
    status: AttendanceStatus;
    observation?: string;
};

// Un registro guardado: el estado de un alumno en una clase, con sus datos.
export type AttendanceRecord = {
    id: string;
    classSessionId: string;
    studentId: string;
    status: AttendanceStatus;
    observation: string | null;
    student: {
        id: string;
        firstName: string;
        lastName: string;
        studentNumber: string;
        documentNumber: string;
    };
};