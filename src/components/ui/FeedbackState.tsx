import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type FeedbackStateProps = {
    title: string;
    description?: string;
    variant?: 'loading' | 'error' | 'empty';
    actionLabel?: string;
    onAction?: () => void;
};

export function FeedbackState({ title, description, variant = 'loading', actionLabel, onAction }: FeedbackStateProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {variant === 'loading' && (
                <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
            )}
            <Text style={[styles.title, { color: variant === 'error' ? colors.danger : colors.text }]}>
                {title}
            </Text>
            {description ? (
                <Text style={[styles.description, { color: colors.muted }]}>{description}</Text>
            ) : null}
            {actionLabel && onAction ? (
                <Pressable onPress={onAction} style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.actionText}>{actionLabel}</Text>
                </Pressable>
            ) : null}
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
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        textAlign: 'center',
    },
    description: {
        marginTop: theme.spacing.xs,
        fontSize: theme.fontSize.md,
        textAlign: 'center',
    },
    actionButton: {
        marginTop: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radius.md,
    },
    actionText: {
        color: theme.colors.onAccent,
        fontWeight: theme.fontWeight.semibold,
    },
});