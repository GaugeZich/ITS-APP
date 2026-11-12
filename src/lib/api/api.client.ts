import { env } from "@/config/envs";

const API_URL = env.ITS_API_URL;
const DEFAULT_TIMEOUT_MS = 15_000;

// Status usado cuando no hubo respuesta del servidor (sin conexión o tiempo agotado)
export const NETWORK_ERROR_STATUS = 0;

// Error propio: además del mensaje guarda el código HTTP (status)
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    token?: string | null;
    timeoutMs?: number;
};

// Qué hacer cuando el backend responde 401 a una petición autenticada (token vencido)
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
    onUnauthorized = handler;
}

// <T> es el tipo de lo que devuelve el backend (lo indica quien llama, por ejemplo el service)
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    // Si el servidor no responde en 15 s, se cancela la petición
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    let response: Response;
    try {
        response = await fetch(API_URL + path, {
            method: options.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.token ? { Authorization: 'Bearer ' + options.token } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal,
        });
    } catch {
        // fetch solo falla así cuando no hubo respuesta: sin internet, servidor caído o timeout
        throw new ApiError(
            controller.signal.aborted
                ? 'El servidor tardó demasiado en responder. Probá de nuevo.'
                : 'No hay conexión con el servidor. Revisá tu internet.',
            NETWORK_ERROR_STATUS
        );
    } finally {
        clearTimeout(timeout);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (__DEV__) {
            console.log(`API ${response.status} ${options.method ?? 'GET'} ${path}:`, JSON.stringify(data));
        }
        // NestJS manda 'message' como texto o como lista (errores de validación)
        const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;

        if (response.status === 401 && options.token) {
            onUnauthorized?.();
        }
        throw new ApiError(typeof message === 'string' ? message : '', response.status);
    }

    return data as T;
}