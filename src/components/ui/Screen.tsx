import { PropsWithChildren } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
    style?: ViewStyle;
}>;

export function Screen({ children, style }: ScreenProps) {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }, style]}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: theme.spacing.md,
    },
});