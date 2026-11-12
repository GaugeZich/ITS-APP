import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';

type AppButtonProps = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    colors: typeof theme.colors.light;
};

export function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    colors,
}: AppButtonProps) {
    const isDisabled = disabled || loading;
    const backgroundColor = colors[variant];

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.base,
                { backgroundColor },
                isDisabled && styles.disabled,
                pressed && !isDisabled && styles.pressed,
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: theme.colors.onAccent,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
    },
    disabled: {
        opacity: theme.opacity.disabled,
    },
    pressed: {
        opacity: theme.opacity.pressed,
    },
});