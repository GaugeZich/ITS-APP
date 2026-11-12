import { PropsWithChildren } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
    style?: ViewStyle;
    edges?: Edge[];
}>;

export function Screen({ children, style, edges = ['left', 'right', 'bottom'] }: ScreenProps) {
    const { colors } = useTheme();

    return (
        <SafeAreaView edges={edges} style={[styles.screen, { backgroundColor: colors.background }, style]}>
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