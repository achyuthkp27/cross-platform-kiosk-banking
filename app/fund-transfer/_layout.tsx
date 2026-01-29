import { Stack } from 'expo-router';

export default function FundTransferLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="wizard" />
        </Stack>
    );
}
