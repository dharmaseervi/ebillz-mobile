import * as React from 'react';
import { TextInput, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const SignUpScreen = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const onSignUpPress = async () => {
        if (!isLoaded || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null); // Reset error state before new attempt

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null); // Reset error state before new attempt

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace('/dashboard'); // Navigate to the dashboard after sign-up
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center px-4 bg-gray-50">
            {!pendingVerification ? (
                <View className="space-y-4">
                    <Text className="text-3xl font-bold text-center mb-6 text-indigo-700">Create Account</Text>
                    {error && <Text className="text-red-500 text-center">{error}</Text>}
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter your email"
                        onChangeText={setEmailAddress}
                        className="border border-gray-300 px-4 py-3 rounded-md bg-white text-lg"
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        value={password}
                        placeholder="Enter your password"
                        secureTextEntry
                        onChangeText={setPassword}
                        className="border border-gray-300 px-4 py-3 rounded-md bg-white text-lg"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        className="mt-6 bg-indigo-700 py-3 rounded-md flex justify-center items-center"
                        onPress={onSignUpPress}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white text-lg font-medium">Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="space-y-4">
                    <Text className="text-xl font-bold text-center mb-4 text-indigo-700">Verify Your Email</Text>
                    {error && <Text className="text-red-500 text-center">{error}</Text>}
                    <TextInput
                        value={code}
                        placeholder="Enter verification code"
                        onChangeText={setCode}
                        className="border border-gray-300 px-4 py-3 rounded-md bg-white text-lg"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        className="mt-6 bg-indigo-700 py-3 rounded-md flex justify-center items-center"
                        onPress={onPressVerify}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white text-lg font-medium">Verify Email</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
export default SignUpScreen