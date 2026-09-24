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
            {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: theme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        fontSize: 16,
    },
    errorText: {
        marginTop: theme.spacing.xs,
        fontSize: 12,
    },
});