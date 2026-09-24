import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/features/auth/useSession';
import { useTheme } from '@/constants/theme.context';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function PrivateLayout() {
    const { user, isLoading } = useSession();
    const { colors } = useTheme();

    if (isLoading) {
        return <FeedbackState title="Validando sesión..." />;
    }

    if (!user) {
        return <Redirect href="/(public)/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTitleStyle: { color: colors.text },
                headerRight: () => <ThemeToggle />,
                tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Mi Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}