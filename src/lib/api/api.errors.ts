import { ApiError, NETWORK_ERROR_STATUS } from './api.client';

// Mensajes genéricos que NestJS pone solo; no le dicen nada útil a la persona
const GENERIC_BACKEND_MESSAGES = [
    'Bad Request',
    'Unauthorized',
    'Forbidden',
    'Forbidden resource',
    'Not Found',
    'Conflict',
    'Internal server error',
    'Internal Server Error',
];

function specificBackendMessage(error: ApiError): string | null {
    const message = error.message.trim();
    return message && !GENERIC_BACKEND_MESSAGES.includes(message) ? message : null;
}

/**
 * Traduce cualquier error a un mensaje para mostrar en pantalla.
 * Si el backend explica el motivo (reglas de negocio), se usa ese texto.
 */
export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
    if (!(error instanceof ApiError)) return fallback;

    const fromBackend = specificBackendMessage(error);

    if (error.status === NETWORK_ERROR_STATUS) return error.message;
    if (error.status === 400) return fromBackend ?? 'Los datos enviados no son válidos.';
    if (error.status === 401) return 'Tu sesión venció. Iniciá sesión de nuevo.';
    if (error.status === 403) return fromBackend ?? 'No tenés permiso para hacer esto.';
    if (error.status === 404) return 'No se encontró lo que buscabas. Puede que se haya eliminado.';
    if (error.status === 409) return fromBackend ?? 'La operación choca con datos que ya existen.';
    if (error.status === 429) return 'Demasiados intentos. Esperá un minuto y probá de nuevo.';
    if (error.status >= 500) return 'El servidor tuvo un problema. Probá de nuevo en unos minutos.';

    return fromBackend ?? fallback;
}

export function isApiError(error: unknown, status: number): error is ApiError {
    return error instanceof ApiError && error.status === status;
}