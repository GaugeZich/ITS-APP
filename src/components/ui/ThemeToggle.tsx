import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Pressable onPress={toggleTheme} style={styles.button}>
            <Text style={styles.text}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: theme.spacing.sm,
        borderRadius: theme.radius.pill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: theme.fontSize.title,
    },
});