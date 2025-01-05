import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { EvilIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

const AddItemModal = ({ visible, onClose }) => {
    const [itemName, setItemName] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    const [generatedBarcode, setGeneratedBarcode] = useState('');
    const { user } = useUser();

    const handleSubmit = async () => {
        if (
            itemName.trim() === '' ||
            hsnCode.trim() === '' ||
            rate.trim() === '' ||
            quantity.trim() === '' ||
            description.trim() === '' ||
            unit.trim() === ''
        ) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // Automatically generate a unique barcode
        const uniqueBarcode = `${itemName}-${Date.now()}`;
        setGeneratedBarcode(uniqueBarcode);

        const newItem = {
            name: itemName,
            hsnCode,
            sellingPrice: parseFloat(rate),
            quantity: parseInt(quantity),
            description,
            unit,
            barcode: uniqueBarcode,
            userId: user?.id,
        };

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!res.ok) {
                throw new Error('Failed to add item');
            }

            // Clear the form
            setItemName('');
            setHsnCode('');
            setRate('');
            setQuantity('');
            setDescription('');
            setUnit('');
            setGeneratedBarcode('');
            Alert.alert('Success', 'Item added successfully!');
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to add item. Please try again.');
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View className="flex-1 bg-gray-100 pt-16">
                <View className="flex flex-row justify-between px-3 py-2">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-indigo-600 text-lg font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-800">Add New Stock</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text className="text-indigo-600 text-lg font-bold">Save</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white m-3 p-3 rounded-lg">
                    {renderInput('Enter item name', itemName, setItemName, 'default', false, 'Item Name', false)}
                    {renderInput('Enter HSN Code', hsnCode, setHsnCode, 'default', false, 'HSN Code', false)}
                    {renderInput('Enter rate', rate, setRate, 'numeric', false, 'Rate', false)}
                    {renderInput('Enter quantity', quantity, setQuantity, 'numeric', false, 'Quantity', false)}
                    {renderInput('Enter description', description, setDescription, 'default', true, 'Description', false)}
                    {renderInput('Enter unit', unit, setUnit, 'default', false, 'Unit', true)}
                </View>
            </View>
        </Modal>
    );
};

// Updated renderInput function with lastInput prop
const renderInput = (placeholder, value, onChangeText, keyboardType = 'default', multiline = false, label, isLast) => (
    <View className={`w-full flex flex-row justify-between  ${!isLast ? 'border-b border-gray-200' : ''} p-2`}>
        <Text className="text-lg  text-gray-700">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            className="text-gray-800 flex"
        />
    </View>
);

export default AddItemModal;
