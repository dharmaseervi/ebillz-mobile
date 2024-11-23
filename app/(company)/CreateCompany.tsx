import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

interface CompanyDetails {
    companyName: string;
    address: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    contactNumber: string;
    gstNumber: string;
    userId: string;
}

const CreateCompany = () => {
    const { user } = useUser();
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
        companyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactNumber: '',
        gstNumber: '',
        email: '',
       userId: user ? user.id : '' 
    });

    const handleInputChange = (field: keyof CompanyDetails, value: string) => {
        setCompanyDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validate all fields are filled
        if (Object.values(companyDetails).some(value => value.trim() === '')) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyDetails),
            });

            if (response.ok) {
                Alert.alert('Success', 'Company created successfully', [
                    { text: 'OK', onPress: () => router.replace('/') }
                ]);
            } else {
                throw new Error('Failed to create company');
            }
        } catch (error) {
            console.error('Error creating company:', error);
            Alert.alert('Error', 'Failed to create company. Please try again.');
        }
    };

    return (
        <ScrollView className="flex bg-gray-100 dark:bg-gray-900">
            <View className="p-6">
                <Text className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Create Your Company</Text>

                <View className="space-y-4">
                    {/* Company Name */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</Text>
                        <TextInput
                            value={companyDetails.companyName}
                            onChangeText={(value) => handleInputChange('companyName', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter company name"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* Email */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Email</Text>
                        <TextInput
                            value={companyDetails.email}
                            onChangeText={(value) => handleInputChange('email', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter company email"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* Address */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</Text>
                        <TextInput
                            value={companyDetails.address}
                            onChangeText={(value) => handleInputChange('address', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter company address"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* City */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</Text>
                        <TextInput
                            value={companyDetails.city}
                            onChangeText={(value) => handleInputChange('city', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter city"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* State */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</Text>
                        <TextInput
                            value={companyDetails.state}
                            onChangeText={(value) => handleInputChange('state', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter state"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    {/* ZIP Code */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</Text>
                        <TextInput
                            value={companyDetails.zip}
                            onChangeText={(value) => handleInputChange('zip', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter ZIP code"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Mobile Number */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</Text>
                        <TextInput
                            value={companyDetails.contactNumber}
                            onChangeText={(value) => handleInputChange('contactNumber', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter mobile number"
                            placeholderTextColor="#9ca3af"
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* GST Number */}
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</Text>
                        <TextInput
                            value={companyDetails.gstNumber}
                            onChangeText={(value) => handleInputChange('gstNumber', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter GST number"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="mt-8 bg-blue-500 py-3 px-6 rounded-lg"
                >
                    <Text className="text-white font-semibold text-center text-lg">Create Company</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default CreateCompany;
