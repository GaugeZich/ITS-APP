import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/theme.context';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function TabsLayout() {
    const { colors } = useTheme();

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
                    tabBarIcon: ({ focused, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={focused ? colors.primary : colors.muted}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Mi Perfil',
                    tabBarIcon: ({ focused, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={focused ? colors.primary : colors.muted}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}