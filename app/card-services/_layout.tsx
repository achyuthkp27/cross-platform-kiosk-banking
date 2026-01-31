import { Stack } from 'expo-router';

export default function CardServicesLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[action]" />
            <Stack.Screen name="request" />
        </Stack>
    );
}
