import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { router, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';

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

interface BankDetails {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
}

const CreateCompany = () => {
    const { user } = useUser();
    const router = useRouter()
    const [companyId, setCompanyId] = useState('')
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
        companyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactNumber: '',
        gstNumber: '',
        email: '',
        userId: user ? user.id : '',
    });

    const [bankDetails, setBankDetails] = useState<BankDetails>({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        userId: user ? user.id : '',
    });
    console.log(bankDetails);

    const [isModalVisible, setModalVisible] = useState(false);

    const handleInputChange = (field: keyof CompanyDetails, value: string) => {
        setCompanyDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleBankInputChange = (field: keyof BankDetails, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    const fetchCompanyDetails = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/company?userId=${userId}`);
            const data = await response.json();
            setCompanyId(data?.Company[0]._id)
        } catch (error) {
            console.error('Error fetching company details:', error);
            Alert.alert('Error', 'Failed to fetch company details');
        }
    };
    useEffect(() => {
        if (user) {
            fetchCompanyDetails(user.id);
        }
    }, [user]);
    console.log(companyId, 'id');

    const handleSubmit = async () => {
        if (Object.values(companyDetails).some(value => value.trim() === '')) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const payload = { ...companyDetails, bankDetails };
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/company`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Alert.alert('Success', 'Company created successfully', [
                    { text: 'OK', onPress: () => router.replace('/') },
                ]);
            } else {
                throw new Error('Failed to create company');
            }
        } catch (error) {
            console.error('Error creating company:', error);
            Alert.alert('Error', 'Failed to create company. Please try again.');
        }
    };

    const createBankDetails = async () => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/bank`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...bankDetails, companyId }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Bank details created:', data);
        } else {
            console.error('Error creating bank details:', data);
        }
    };



    return (
        <ScrollView className="flex bg-white">
            <View className="p-6">
                <View className='flex-row justify-between  items-center py-2'>
                    <TouchableOpacity className='flex-row justify-center items-center gap-2' onPress={() => router.push('/more')}>
                        <FontAwesome name={'arrow-left'} color={'#4338ca'} />
                        <Text className='text-indigo-700 text-xl'>back</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 ">
                        Create Your Company
                    </Text>
                </View>
                <View className="flex flex-row flex-wrap -mx-2">
                    {/* Form Fields */}
                    {[
                        { label: 'Company Name', field: 'companyName', placeholder: 'Enter company name' },
                        { label: 'Email', field: 'email', placeholder: 'Enter company email' },
                        { label: 'Address', field: 'address', placeholder: 'Enter company address' },
                        { label: 'City', field: 'city', placeholder: 'Enter city' },
                        { label: 'State', field: 'state', placeholder: 'Enter state' },
                        { label: 'ZIP Code', field: 'zip', placeholder: 'Enter ZIP code', keyboardType: 'numeric' },
                        { label: 'Mobile Number', field: 'contactNumber', placeholder: 'Enter mobile number', keyboardType: 'phone-pad' },
                        { label: 'GST Number', field: 'gstNumber', placeholder: 'Enter GST number' },
                    ].map(({ label, field, placeholder, keyboardType }, index) => (
                        <View key={index} className="w-full sm:w-1/2 px-2 mb-4">
                            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {label}
                            </Text>
                            <TextInput
                                value={companyDetails[field as keyof CompanyDetails]}
                                onChangeText={(value) => handleInputChange(field as keyof CompanyDetails, value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                                placeholder={placeholder}
                                placeholderTextColor="#9ca3af"
                                keyboardType={keyboardType}
                            />
                        </View>
                    ))}
                </View>

                {/* Add Bank Details */}
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="mt-4 bg-indigo-700 py-4 px-4 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold">Add Bank Details</Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="mt-2 bg-indigo-700 py-3 px-6 rounded-lg"
                >
                    <Text className="text-white font-semibold text-center text-lg">Create Company</Text>
                </TouchableOpacity>
            </View>

            {/* Bank Details Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg p-6 w-11/12">
                        <Text className="text-lg font-bold mb-4">Enter Bank Details</Text>
                        {[
                            { label: 'Account Name', field: 'accountName', placeholder: 'Enter account name' },
                            { label: 'Account Number', field: 'accountNumber', placeholder: 'Enter account number', keyboardType: 'numeric' },
                            { label: 'IFSC Code', field: 'ifscCode', placeholder: 'Enter IFSC code' },
                            { label: 'Bank Name', field: 'bankName', placeholder: 'Enter bank name' },
                        ].map(({ label, field, placeholder, keyboardType }, index) => (
                            <View key={index} className="mb-4">
                                <Text className="text-sm font-medium mb-1">{label}</Text>
                                <TextInput
                                    value={bankDetails[field as keyof BankDetails]}
                                    onChangeText={(value) => handleBankInputChange(field as keyof BankDetails, value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder={placeholder}
                                    placeholderTextColor="#9ca3af"
                                    keyboardType={keyboardType}
                                />
                            </View>
                        ))}
                        <TouchableOpacity
                            onPress={() => createBankDetails()}
                            className="bg-indigo-500 py-2 px-4 rounded-lg mt-4"
                        >
                            <Text className="text-white text-center font-semibold">Save Bank Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-indigo-500 py-2 px-4 rounded-lg mt-4"
                        >
                            <Text className="text-white text-center font-semibold">close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default CreateCompany;
