export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';

export type AttendanceTotals = Record<AttendanceStatus, number>;

export type ClassSession = {
    id: string;
    courseOfferingId: string;
    date: string;
    topic: string | null;
    notes: string | null;
    status: 'OPEN' | 'CLOSED';
};

export type AttendanceRecordInput = {
    studentId: string;
    status: AttendanceStatus;
    observation?: string;
};

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