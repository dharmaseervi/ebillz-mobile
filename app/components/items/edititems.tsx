import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useUser } from '@clerk/clerk-expo';

const UpdateItems = ({ itemId }: string) => {
    const [itemName, setItemName] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    const { user } = useUser();

    // Fetch item details when modal is opened
    useEffect(() => {
        if (itemId) {
            fetchItemDetails();
        }
    }, [itemId]);

    const fetchItemDetails = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item?id=${itemId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch item details');
            }
            const Itemdata = await res.json();
            const data = Itemdata.filterData
            setItemName(data.name);
            setHsnCode(data.hsnCode);
            setRate(data.sellingPrice.toString());
            setQuantity(data.quantity.toString());
            setDescription(data.description);
            setUnit(data.unit);
        } catch (error) {
            Alert.alert('Error', 'Failed to load item details. Please try again.');
        }
    };

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

        const updatedItem = {
            name: itemName,
            hsnCode,
            sellingPrice: parseFloat(rate),
            quantity: parseInt(quantity),
            description,
            unit,
            userId: user?.id,
            id: itemId
        };

        try {
            const res = await fetch(`http://192.168.1.24:3000/api/item?id=${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!res.ok) {
                throw new Error('Failed to update item');
            }



            Alert.alert('Success', 'Item updated successfully!');

        } catch (error) {
            Alert.alert('Error', 'Failed to update item. Please try again.');
        }
    };

    return (
        <View className="flex-1">
            <View className="bg-gray-200 m-3 p-3 rounded-lg">
                {renderInput('Enter item name', itemName, setItemName, 'default', false, 'Item Name', false)}
                {renderInput('Enter HSN Code', hsnCode, setHsnCode, 'default', false, 'HSN Code', false)}
                {renderInput('Enter rate', rate, setRate, 'numeric', false, 'Rate', false)}
                {renderInput('Enter quantity', quantity, setQuantity, 'numeric', false, 'Quantity', false)}
                {renderInput('Enter description', description, setDescription, 'default', true, 'Description', false)}
                {renderInput('Enter unit', unit, setUnit, 'default', false, 'Unit', true)}
            </View>
            <View className="px-2 ">
                <TouchableOpacity onPress={handleSubmit}>
                    <Text className="text-white text-center  bg-indigo-700 px-4 rounded-lg py-2 text-lg font-bold ">Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Reusing renderInput function
const renderInput = (placeholder, value, onChangeText, keyboardType = 'default', multiline = false, label, isLast) => (
    <View className={`w-full flex flex-row justify-between  ${!isLast ? 'border-b border-gray-300' : ''} p-2`}>
        <Text className="text-lg font-medium text-gray-700">{label}</Text>
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

export default UpdateItems;
