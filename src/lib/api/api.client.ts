const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(API_URL + path, {
        method: options.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.token ? { Authorization: 'Bearer ' + options.token } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        console.log('BACKEND ERROR BODY COMPLETO:', JSON.stringify(data)); // 👈 agregá esto
        const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
        throw new ApiError(message ?? 'Error del servidor', response.status);
    }

    return data as T;
}