import { apiRequest } from '@/lib/api/api.client';
import { LoginCredentials, LoginResponse, MeResponse } from './auth.types';

// POST /auth/login: devuelve el token (JWT) y el usuario con su rol
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
    });
}

// GET /auth/me: con un token guardado devuelve el usuario
export async function getMe(token: string): Promise<MeResponse> {
    return apiRequest<MeResponse>('/auth/me', {
        method: 'GET',
        token,
    });
}