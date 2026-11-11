import { useState } from 'react';
import { Redirect } from 'expo-router';
import { Text, StyleSheet, Image, View } from 'react-native';
import { useSession } from '@/features/auth/useSession';
import { getHomeHref } from '@/features/auth/auth.routes';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { Screen } from '@/components/ui/Screen';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
    const { user, signIn, signOut } = useSession();
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Si hay sesión (incluso persistida por SecureStore), redirige al área de su rol
    if (user) {
        const home = getHomeHref(user.role);
        if (home) return <Redirect href={home} />;

        return (
            <FeedbackState
                title="Esta app es para docentes y estudiantes"
                description="Tu usuario es de secretaría o administración: ingresá desde el sistema web."
                variant="error"
                actionLabel="Cerrar sesión"
                onAction={signOut}
            />
        );
    }

    async function handleSubmit() {
        try {
            setError('');
            setSubmitting(true);
            await signIn({ email, password });
        } catch {
            setError('Credenciales inválidas o problema de conexión');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            <View style={styles.toggleContainer}>
                <ThemeToggle />
            </View>

            <View style={styles.content}>
                <Image
                    source={require('@/../assets/images/its-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={[styles.title, { color: colors.text }]}>
                    Iniciar sesión
                </Text>

                <View style={styles.form}>
                    <AppInput
                        label="Email"
                        colors={colors}
                        placeholder="tu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <AppInput
                        label="Contraseña"
                        colors={colors}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={error}
                    />

                    <AppButton
                        title="Ingresar"
                        onPress={handleSubmit}
                        loading={submitting}
                        disabled={!email || !password}
                        colors={colors}
                    />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        position: 'absolute',
        top: theme.spacing.lg,
        right: theme.spacing.lg,
        zIndex: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },
    form: {
        width: '100%',
        maxWidth: 340,
    },
});