import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Profile = () => {
    const { user } = useUser();

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [profileImage, setProfileImage] = useState(user?.profileImageUrl || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        try {
            if (!user) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Update the user's profile information
            await user.update({
                firstName: fullName.split(' ')[0], // Assuming first name is the first word
                lastName: fullName.split(' ').slice(1).join(' '), // Remaining words as last name
            });

            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-6">

            <Link className='text-xl text-indigo-700' href={'/more'}>back</Link>
            {/* Profile Header */}
            <View className="flex items-center mb-6">
                <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                    resizeMode="cover"
                />
                {!isEditing ? (
                    <>
                        <Text className="text-xl font-semibold text-gray-900 mt-4">{fullName || 'User Name'}</Text>
                        <Text className="text-gray-500 text-sm">{user.emailAddresses[0]?.emailAddress}</Text>
                    </>
                ) : (
                    <TextInput
                        className="border border-gray-300 p-2 rounded-lg mt-4 text-center"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                    />
                )}
            </View>

            {/* Edit / Save Buttons */}
            <TouchableOpacity
                className={`p-3 rounded-lg items-center ${isEditing ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
            >
                <Text className="text-white text-lg font-medium">{isEditing ? 'Save' : 'Edit Profile'}</Text>
            </TouchableOpacity>

            {/* Cancel Editing */}
            {isEditing && (
                <TouchableOpacity
                    className="mt-3 bg-gray-500 p-3 rounded-lg items-center"
                    onPress={() => setIsEditing(false)}
                >
                    <Text className="text-white text-lg font-medium">Cancel</Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Profile;
