import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { useCourseStudents } from '@/features/courses/useCourseStudents';
import { AttendanceStatusSelector } from '@/components/attendance/AttendanceStatusSelector';
import { Screen } from '@/components/ui/Screen';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';
import { ApiError } from '@/lib/api/api.client';
import {
    createClassSession,
    markBulkAttendance,
    closeClassSession,
    getSessionAttendance,
    updateAttendanceRecord,
} from '@/features/attendance/attendance.service';
import { AttendanceStatus, ClassSession } from '@/features/attendance/attendance.types';

function todayLocal() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AttendanceScreen() {
    const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
    return <AttendanceScreenInner key={sessionId ?? 'new'} />;
}

function AttendanceScreenInner() {
    const { id, sessionId, topic: topicParam, date: dateParam } = useLocalSearchParams<{
        id: string;
        sessionId?: string;
        topic?: string;
        date?: string;
    }>();
    const isEditMode = Boolean(sessionId);

    const router = useRouter();
    const { token, signOut } = useSession();
    const { colors } = useTheme();
    const { students, isLoading, error: loadError, reload } = useCourseStudents(id);

    const [date] = useState(dateParam ?? todayLocal);
    const [topic, setTopic] = useState(topicParam ?? '');
    const [session, setSession] = useState<ClassSession | null>(
        isEditMode
            ? { id: sessionId!, courseOfferingId: id, date: date, topic: topicParam ?? null, notes: null, status: 'OPEN' }
            : null
    );
    const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
    const [recordIds, setRecordIds] = useState<Record<string, string>>({});
    const [loadingAttendance, setLoadingAttendance] = useState(isEditMode);
    const [saved, setSaved] = useState(false);
    const [done, setDone] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const header = (
        <Stack.Screen options={{ title: isEditMode ? 'Editar asistencia' : 'Clase y asistencia' }} />
    );

    const statusOf = (studentId: string): AttendanceStatus => statuses[studentId] ?? 'PRESENT';

    useEffect(() => {
        if (!isEditMode || !token) return;
        loadExistingAttendance();
    }, [isEditMode, token]);

    async function loadExistingAttendance() {
        if (!token || !sessionId) return;
        try {
            setLoadingAttendance(true);
            const response = await getSessionAttendance(sessionId, token);

            const nextStatuses: Record<string, AttendanceStatus> = {};
            const nextRecordIds: Record<string, string> = {};
            response.data.forEach((record) => {
                nextStatuses[record.studentId] = record.status;
                nextRecordIds[record.studentId] = record.id;
            });

            setStatuses(nextStatuses);
            setRecordIds(nextRecordIds);
        } catch (e) {
            console.log('ATTENDANCE LOAD ERROR:', e);
            setError('No se pudo cargar la asistencia de esta clase');
        } finally {
            setLoadingAttendance(false);
        }
    }

    async function run(action: () => Promise<void>, conflictMessage?: string) {
        try {
            setError('');
            setBusy(true);
            await action();
        } catch (e) {
            console.log('ERROR EN RUN:', e);
            if (e instanceof ApiError) {
                console.log('STATUS:', e.status, 'MESSAGE:', e.message);
            }
            if (e instanceof ApiError && e.status === 401) {
                await signOut();
                return;
            }
            if (e instanceof ApiError && e.status === 409 && conflictMessage) {
                setError(conflictMessage);
                return;
            }
            setError('Error desconocido');
        } finally {
            setBusy(false);
        }
    }

    function startClass() {
        if (!token) return;
        run(async () => {
            const response = await createClassSession(id, { date, topic: topic.trim() }, token);
            setSession(response.data);
        }, 'Ya existe una clase de esta materia para hoy. Revisala en el historial.');
    }

    function saveAndClose() {
        if (!token || !session) return;
        run(async () => {
            if (!saved) {
                await markBulkAttendance(
                    session.id,
                    students.map((s) => ({ studentId: s.id, status: statusOf(s.id) })),
                    token
                );
                setSaved(true);
            }
            await closeClassSession(session.id, token);
            setDone(true);
        });
    }

    function saveEdits() {
        if (!token) return;
        run(async () => {
            const updates = students
                .map((s) => ({ studentId: s.id, recordId: recordIds[s.id], status: statusOf(s.id) }))
                .filter((u) => u.recordId);

            const results = await Promise.all(
                updates.map((u) =>
                    updateAttendanceRecord(u.recordId, { status: u.status, observation: '' }, token)
                )
            );

            console.log('RESPUESTAS DE LOS PATCH:', JSON.stringify(results)); // 👈 agregá esto

            setDone(true);
        });
    }

    if (done) {
        return (
            <>
                {header}
                <FeedbackState
                    title={isEditMode ? 'Asistencia actualizada' : 'Asistencia guardada'}
                    description={date}
                    variant="empty"
                    actionLabel="Volver"
                    onAction={() => router.replace(`/(teacher)/course-offerings/${id}`)}
                />
            </>
        );
    }

    if ((isLoading && students.length === 0) || loadingAttendance) {
        return <>{header}<FeedbackState title="Cargando..." /></>;
    }

    if (loadError) {
        return (
            <>
                {header}
                <FeedbackState
                    title="No se pudieron cargar los estudiantes"
                    description={loadError}
                    variant="error"
                    actionLabel="Reintentar"
                    onAction={reload}
                />
            </>
        );
    }

    if (students.length === 0) {
        return <>{header}<FeedbackState title="Sin estudiantes inscriptos" variant="empty" /></>;
    }

    if (!session) {
        const canStart = topic.trim() !== '' && !busy;
        return (
            <Screen style={{ backgroundColor: colors.background }}>
                {header}
                <Text style={[styles.label, { color: colors.text }]}>Fecha: {date}</Text>

                <AppInput
                    label="Tema de la clase"
                    colors={colors}
                    placeholder="Ej: Navegación con Expo Router"
                    value={topic}
                    onChangeText={setTopic}
                />

                {error !== '' ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

                <AppButton
                    title={busy ? 'Iniciando...' : 'Iniciar clase'}
                    colors={colors}
                    onPress={startClass}
                    disabled={!canStart}
                    loading={busy}
                />
            </Screen>
        );
    }

    return (
        <Screen style={{ backgroundColor: colors.background }}>
            {header}
            <FlatList
                data={students}
                extraData={statuses}
                keyExtractor={(s) => s.id}
                ListHeaderComponent={
                    <View>
                        <Text style={[styles.topic, { color: colors.text }]}>
                            Tema: {session.topic ?? 'Sin tema'}
                        </Text>
                        <Text style={[styles.dateText, { color: colors.muted }]}>Fecha: {date}</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {item.lastName}, {item.firstName}
                        </Text>
                        <AttendanceStatusSelector
                            value={statusOf(item.id)}
                            disabled={!isEditMode && saved}
                            onChange={(s) => setStatuses((prev) => ({ ...prev, [item.id]: s }))}
                        />
                    </View>
                )}
            />
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                {error !== '' ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
                <AppButton
                    title={
                        busy
                            ? 'Guardando...'
                            : isEditMode
                                ? 'Guardar cambios'
                                : saved
                                    ? 'Reintentar cierre'
                                    : 'Guardar y cerrar clase'
                    }
                    colors={colors}
                    onPress={isEditMode ? saveEdits : saveAndClose}
                    disabled={busy}
                    loading={busy}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 14, marginBottom: theme.spacing.sm },
    topic: { fontSize: 18, fontWeight: '600' },
    dateText: { fontSize: 13, marginBottom: theme.spacing.md },
    card: { borderWidth: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.sm },
    name: { fontSize: 15, fontWeight: '600' },
    footer: { paddingTop: theme.spacing.md, borderTopWidth: 1 },
    error: { marginBottom: theme.spacing.sm },
});