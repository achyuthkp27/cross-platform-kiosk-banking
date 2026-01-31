import { Stack } from 'expo-router';

export default function ChequeBookLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="order" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="otp" />
        </Stack>
    );
}
