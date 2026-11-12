import { Shift } from '@/features/courses/courses.types';
import { AttendanceStatus, AttendanceTotals } from '@/features/attendance/attendance.types';

export type EnrollmentStatus = 'ACTIVE' | 'DROPPED' | 'COMPLETED' | 'VOID';

export type EnrollmentCondition =
    | 'IN_PROGRESS'
    | 'REGULAR'
    | 'NOT_REGULAR'
    | 'PROMOTED'
    | 'ABANDONED';

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

export type StudentAttendanceHistory = {
    totals: AttendanceTotals;
    records: StudentAttendanceRecord[];
};