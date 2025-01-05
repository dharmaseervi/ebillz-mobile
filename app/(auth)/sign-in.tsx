import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, View, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import React from 'react';

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return;
        }
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error('Sign-in attempt failed: ', JSON.stringify(signInAttempt, null, 2));
                alert('Sign-in failed. Please check your credentials.');
            }
        } catch (err: any) {
            console.error('Error during sign-in: ', JSON.stringify(err, null, 2));
            alert('An error occurred. Please try again later.');
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <ImageBackground
            source={require('../../assets/images/bg.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View className="flex-1 justify-center px-4">
                <Text className="text-3xl font-bold text-center mb-6 text-white">
                    Welcome Back
                </Text>

                <View className="flex gap-2  ">
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Enter your email"
                        onChangeText={setEmailAddress}
                        className="border border-gray-300 rounded-md text-black px-4 py-3 bg-white   "
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        value={password}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        className="border border-gray-300 rounded-md text-black px-4 py-3 bg-white "
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity
                    className="mt-6 bg-indigo-700 py-3 rounded-md flex justify-center items-center "
                    onPress={onSignInPress}
                // Disable button while attempting sign-in
                >
                    <Text className="text-white text-lg font-medium">
                        Sign In
                    </Text>
                </TouchableOpacity>
                
                <View className="mt-4 flex justify-center items-center flex-row">
                    <Text className="text-white">Don't have an account?</Text>
                    <Link href="/sign-up">
                        <Text className="text-white underline font-bold ml-2">
                            Sign up
                        </Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
    );
}
export default SignIn