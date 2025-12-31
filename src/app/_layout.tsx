import { Stack } from 'expo-router';
import { colors } from '../theme/colors';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.softPink,
                },
                headerTintColor: colors.deepPurple,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: colors.white,
                },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="name-entry" options={{ title: 'Start Test' }} />
            <Stack.Screen name="join-session" options={{ title: 'Join Partner' }} />
            <Stack.Screen name="questions" options={{ title: 'Quiz', headerBackVisible: false }} />
            <Stack.Screen name="waiting" options={{ title: 'Waiting...', headerBackVisible: false }} />
            <Stack.Screen name="results" options={{ title: 'Verdicts', headerShown: false }} />
        </Stack>
    );
}
