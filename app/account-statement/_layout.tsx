import { Stack } from 'expo-router';

export default function AccountStatementLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="view" />
        </Stack>
    );
}
