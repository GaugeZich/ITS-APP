import { Stack, Redirect } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { getHomeHref } from '@/features/auth/auth.routes';
import { useTheme } from '@/constants/theme.context';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// anchor: las pestañas quedan siempre debajo, así "atrás" vuelve a ellas.
export const unstable_settings = {
    anchor: '(tabs)',
};

export default function TeacherLayout() {
    const { user, isLoading } = useSession();
    const { colors } = useTheme();

    // Mientras se restaura la sesión al abrir la app.
    if (isLoading) {
        return <FeedbackState title="Validando sesión..." />;
    }

    if (!user) {
        return <Redirect href="/(public)/login" />;
    }

    // Si no es profesor, lo manda al inicio de su rol o al login
    if (user.role !== 'TEACHER') {
        return <Redirect href={getHomeHref(user.role) ?? '/(public)/login'} />;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTitleStyle: { color: colors.text },
                headerTintColor: colors.primary,
                headerRight: () => <ThemeToggle />,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}