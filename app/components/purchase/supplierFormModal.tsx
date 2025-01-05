import { useUser } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';

const SupplierFormModal = ({ visible, onClose }) => {
    const { user } = useUser();
    const [supplierData, setSupplierData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        gst:'',
        userId: user?.id,
    });

    // Handle input change
    const handleInputChange = (field, value) => {
        setSupplierData({ ...supplierData, [field]: value });
    };

    // Handle Save action
    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/supplier`, {
                method: 'POST',
                body: JSON.stringify(supplierData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to save supplier');
            }

            const data = await response.json();
            console.log('Supplier saved successfully', data);

            // Reset the form state only if the save is successful
            setSupplierData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                gst:'',
                userId: user?.id,
            });

            // Close the modal after saving
            onClose();
        } catch (error) {
            // Show an error message if there is an issue
            Alert.alert('Error', error.message || 'Failed to save the supplier');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-white pt-16 px-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-blue-500 text-base">Close</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-800">Add Supplier</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text className="text-blue-500 text-base">Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View className="space-y-4">
                        {/* Supplier Name */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier Name</Text>
                            <TextInput
                                placeholder="Enter Supplier Name"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.name}
                                onChangeText={(value) => handleInputChange('name', value)}
                            />
                        </View>

                        {/* Supplier Email */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier Email</Text>
                            <TextInput
                                placeholder="Enter Supplier Email"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Supplier Phone */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier Phone</Text>
                            <TextInput
                                placeholder="Enter Supplier Phone"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.phone}
                                onChangeText={(value) => handleInputChange('phone', value)}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Supplier Address */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier Address</Text>
                            <TextInput
                                placeholder="Enter Supplier Address"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.address}
                                onChangeText={(value) => handleInputChange('address', value)}
                            />
                        </View>

                        {/* Supplier City */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier City</Text>
                            <TextInput
                                placeholder="Enter Supplier City"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.city}
                                onChangeText={(value) => handleInputChange('city', value)}
                            />
                        </View>

                        {/* Supplier State */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier State</Text>
                            <TextInput
                                placeholder="Enter Supplier State"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.state}
                                onChangeText={(value) => handleInputChange('state', value)}
                            />
                        </View>

                        {/* gst */}
                        <View>
                            <Text className="text-gray-600 font-medium mb-1">Supplier GST</Text>
                            <TextInput
                                placeholder="Enter Supplier GST"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={supplierData.gst}
                                onChangeText={(value) => handleInputChange('gst', value)}
                            />
                        </View>
                    </View>

                </ScrollView>
            </View>
        </Modal>
    );
};

export default SupplierFormModal;
