import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';

import { router } from 'expo-router';

const AddItems = () => {
    const [itemName, setItemName] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [rate, setRate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    // const { user } = useUser();

    // Function to handle form submission
    const handleSubmit = async () => {
        if (itemName.trim() === '' || hsnCode.trim() === '' || rate.trim() === '' ||
            quantity.trim() === '' || description.trim() === '' || unit.trim() === '') {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // Construct the new item object
        const newItem = {
            name: itemName,
            hsnCode,
            sellingPrice: parseFloat(rate),
            quantity: parseInt(quantity),
            description,
            unit,
            userId: user?.id || ''
        };


        const res = await fetch('http://localhost:3000/api/item', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        router.replace('/(invoice)/CreateInvoice')


        // Clear the form
        setItemName('');
        setHsnCode('');
        setRate('');
        setQuantity('');
        setDescription('');
        setUnit('');
    };

    return (
        <View className="p-4">
            <Text className="text-lg font-bold mb-4">Add New Item</Text>

            <TextInput
                value={itemName}
                onChangeText={setItemName}
                placeholder="Item Name"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TextInput
                value={hsnCode}
                onChangeText={setHsnCode}
                placeholder="HSN Code"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TextInput
                value={rate}
                onChangeText={setRate}
                placeholder="Rate"
                keyboardType="numeric"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Quantity"
                keyboardType="numeric"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TextInput
                value={unit}
                onChangeText={setUnit}
                placeholder="Unit"
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
                <Text className="text-white text-center">Add Item</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddItems;
