import type { Href } from 'expo-router';
import type { UserRole } from './auth.types';

/**
 * Devuelve la pantalla de inicio que corresponde a cada rol.
 * ADMIN y ACADEMIC (secretaría) usan el sistema web, no esta app: devuelve null.
 */
export function getHomeHref(role: UserRole): Href | null {
    switch (role) {
        case 'TEACHER':
            return '/(teacher)/(tabs)';
        case 'STUDENT':
            return '/student';
        default:
            return null;
    }
}