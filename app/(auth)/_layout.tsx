import { Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, ImageBackground, View } from 'react-native';

const AuthRoutesLayout = () => {
    const { isLoaded } = useAuth();

    // Handle loading state
    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Render Auth Screens if user is not signed in
    return (
        <ImageBackground
            source={require('../../assets/images/bg.jpg')} // Background image
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <SafeAreaView style={{ flex: 1 }} >
                <Stack>
                    <Stack.Screen
                        name="sign-in"
                        options={{
                            title: "Sign In",
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="sign-up"
                        options={{
                            title: "Sign Up",
                            headerShown: false,
                        }}
                    />
                </Stack>
            </SafeAreaView>
        </ImageBackground>
    );
}
export default AuthRoutesLayout