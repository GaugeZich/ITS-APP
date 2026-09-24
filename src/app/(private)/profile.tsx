import { Text, StyleSheet, View } from 'react-native';
import { useSession } from '@/features/auth/useSession';
import { useTheme } from '@/constants/theme.context';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
    const { user, signOut } = useSession();
    const { colors } = useTheme();

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            <View style={styles.card}>
                <Text style={[styles.label, { color: colors.muted }]}>Nombre:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{user?.name}</Text>

                <Text style={[styles.label, { color: colors.muted }]}>Email:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{user?.email}</Text>

                {user?.role && (
                    <>
                        <Text style={[styles.label, { color: colors.muted }]}>Rol:</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{user?.role}</Text>
                    </>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <AppButton
                    title="Cerrar sesión"
                    onPress={signOut}
                    variant="danger"
                    colors={colors}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: 13,
        marginTop: theme.spacing.sm,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    buttonContainer: {
        marginTop: theme.spacing.md,
    },
});