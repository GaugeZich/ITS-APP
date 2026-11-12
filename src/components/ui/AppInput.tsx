import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '@/constants/theme';

type AppInputProps = TextInputProps & {
    label: string;
    error?: string;
    colors: typeof theme.colors.light;
};

export function AppInput({ label, error, colors, style, ...rest }: AppInputProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>
                {label}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error ? colors.danger : colors.border,
                        color: colors.text,
                        backgroundColor: colors.surface,
                    },
                    style,
                ]}
                placeholderTextColor={colors.muted}
                {...rest}
            />
            {error ? (
                <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        marginBottom: theme.spacing.xs,
    },
    input: {
        borderWidth: theme.borderWidth.thin,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        fontSize: theme.fontSize.lg,
    },
    errorText: {
        marginTop: theme.spacing.xs,
        fontSize: theme.fontSize.xs,
    },
});