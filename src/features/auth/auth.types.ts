export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
};

export type User = {
    id: string;
    email: string;
    role: string;
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