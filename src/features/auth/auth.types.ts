export type User = {
    id: string;
    name: string;
    email: string;
    role?: string;
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