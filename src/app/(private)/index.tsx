import { Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { useTheme } from '@/constants/theme.context';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';

export default function HomeScreen() {
    const { user } = useSession();
    const { colors } = useTheme();

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            <Text style={[styles.title, { color: colors.text }]}>Hola, {user?.name}</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Esta es un área protegida.</Text>

            <Link href="/(private)/profile" asChild>
                <AppButton title="Ver perfil" colors={colors} onPress={() => { }} />
            </Link>
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
});