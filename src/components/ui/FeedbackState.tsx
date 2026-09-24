import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type FeedbackStateProps = {
    title: string;
    description?: string;
    variant?: 'loading' | 'error' | 'empty';
};

export function FeedbackState({ title, description, variant = 'loading' }: FeedbackStateProps) {
    const { colors } = useTheme(); // 👈 Le sumamos el hook de tema

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {variant === 'loading' && (
                <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
            )}
            <Text style={[styles.title, { color: variant === 'error' ? colors.danger : colors.text }]}>
                {title}
            </Text>
            {description && <Text style={[styles.description, { color: colors.muted }]}>{description}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    spinner: {
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        marginTop: theme.spacing.xs,
        fontSize: 14,
        textAlign: 'center',
    },
});