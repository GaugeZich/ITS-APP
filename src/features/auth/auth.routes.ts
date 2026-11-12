import type { Href } from 'expo-router';
import type { UserRole } from './auth.types';

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