import { Stack } from 'expo-router';
import { SessionProvider } from '@/features/auth/session.provider';
import { ThemeProvider } from '@/constants/theme.context';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SessionProvider>
    </ThemeProvider>
  );
}