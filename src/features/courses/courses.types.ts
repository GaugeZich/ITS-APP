export type Shift = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'VIRTUAL' | 'MIXED';

export type ScheduleSlot = {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    classroom: string | null;
};

// Una cursada: materia + comisión + año lectivo + horarios.
export type CourseOffering = {
    id: string;
    commission: string;
    shift: Shift;
    subject: {
        id: string;
        name: string;
        code: string;
        year: number;
        career: { id: string; name: string };
    };
    academicYear: { id: string; year: number; name: string };
    scheduleSlots: ScheduleSlot[];
    _count: { enrollments: number; classSessions: number; evaluations: number };
};

export type EnrolledStudent = {
    id: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    studentNumber: string;
};

// Envoltorio de todas las respuestas del backend: el contenido viene en `data`.
export type ApiResponse<T> = {
    success: boolean;
    data: T;
    timestamp: string;
};