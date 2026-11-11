import { useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { useTheme } from '@/constants/theme.context';
import { theme } from '@/constants/theme';

export default function QrScannerScreen() {
    const { colors } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedValue, setScannedValue] = useState<string | null>(null);
    const [isScanningEnabled, setIsScanningEnabled] = useState(true);
    const lockRef = useRef(false);

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        if (lockRef.current) return;
        lockRef.current = true;
        setIsScanningEnabled(false);
        setScannedValue(result.data);
    }

    function handleScanAgain() {
        lockRef.current = false;
        setScannedValue(null);
        setIsScanningEnabled(true);
    }

    const header = <Stack.Screen options={{ title: 'Escanear QR' }} />;

    // Estado 1: todavía no sabemos si hay permiso
    if (!permission) {
        return (
            <>
                {header}
                <FeedbackState title="Verificando permiso de cámara..." />
            </>
        );
    }

    // Estado 2: no hay permiso
    if (!permission.granted) {
        return (
            <Screen>
                {header}
                <Text style={[styles.title, { color: colors.text }]}>Permiso de cámara</Text>
                <Text style={[styles.text, { color: colors.muted }]}>
                    La app necesita usar la cámara para leer el código QR de la clase. Solo se lee
                    el código: no se toman ni se guardan fotos.
                </Text>

                {permission.canAskAgain ? (
                    <AppButton title="Permitir cámara" colors={colors} onPress={requestPermission} />
                ) : (
                    <>
                        <Text style={[styles.text, { color: colors.muted }]}>
                            El permiso fue denegado. Podés habilitarlo desde la configuración del
                            sistema.
                        </Text>
                        <AppButton
                            title="Abrir configuración"
                            colors={colors}
                            onPress={() => Linking.openSettings()}
                        />
                    </>
                )}
            </Screen>
        );
    }

    // Estado 3: hay permiso -> cámara y resultado
    return (
        <Screen>
            {header}
            <Text style={[styles.title, { color: colors.text }]}>Escanear QR</Text>

            <View style={[styles.cameraBox, { borderColor: colors.border }]}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={isScanningEnabled ? handleBarcodeScanned : undefined}
                />
            </View>

            {scannedValue ? (
                <>
                    <View
                        style={[
                            styles.resultBox,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                        ]}
                    >
                        <Text style={[styles.resultTitle, { color: colors.text }]}>QR leído</Text>
                        <Text style={[styles.resultText, { color: colors.muted }]}>
                            {scannedValue}
                        </Text>
                    </View>
                    <AppButton
                        title="Escanear nuevamente"
                        colors={colors}
                        variant="secondary"
                        onPress={handleScanAgain}
                    />
                </>
            ) : (
                <Text style={[styles.text, { color: colors.muted }]}>
                    Apuntá la cámara hacia un código QR.
                </Text>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: theme.spacing.md,
    },
    text: {
        marginBottom: theme.spacing.md,
    },
    cameraBox: {
        height: 320,
        overflow: 'hidden',
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        marginBottom: theme.spacing.md,
        backgroundColor: '#000000',
    },
    camera: {
        flex: 1,
    },
    resultBox: {
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        marginBottom: theme.spacing.md,
    },
    resultTitle: {
        fontWeight: '800',
    },
    resultText: {
        marginTop: theme.spacing.xs,
    },
});