export type UserRole = 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'STUDENT';

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
};

export type User = {
    id: string;
    email: string;
    role: UserRole;
    mustChangePassword: boolean;
    profile: UserProfile;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    data: {
        accessToken: string;
        user: User;
    };
    timestamp: string;
};

export type MeResponse = {
    success: boolean;
    data: User;
    timestamp: string;
};