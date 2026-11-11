import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';
import { ClassSession } from '@/features/attendance/attendance.types';

function formatDate(iso: string) {
    const [y, m, d] = iso.slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
}

export function ClassSessionCard({ session, onPress }: { session: ClassSession; onPress?: () => void }) {
    const { colors } = useTheme();
    const open = session.status === 'OPEN';

    return (
        <Pressable
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
            <View style={styles.row}>
                <Text style={[styles.date, { color: colors.text }]}>{formatDate(session.date)}</Text>
                <Text style={[styles.badge, { color: open ? colors.primary : colors.muted }]}>
                    {open ? 'Abierta' : 'Cerrada'}
                </Text>
            </View>
            <Text style={[styles.topic, { color: colors.muted }]}>{session.topic ?? 'Sin tema'}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.sm },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs },
    date: { fontSize: 16, fontWeight: '700' },
    badge: { fontSize: 13, fontWeight: '600' },
    topic: { fontSize: 14 },
});