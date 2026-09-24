import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme.context';

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
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 22,
    },
});