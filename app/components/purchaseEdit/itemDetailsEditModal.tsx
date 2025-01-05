
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ItemDetailsModelProps {
    visible: boolean;
    onClose: () => void;
    item: {
        id: string; // Ensure each item has a unique identifier
        name: string;
        description: string;
        quantity: number;
        sellingPrice: number;
        discount: number;
        cgst: number;
        sgst: number;
        total: number;
    } | null;
    onUpdate: (updatedItem: any) => void; // Callback to send updated data back to the parent
}

const PurchaseItemDetailsEditModel: React.FC<ItemDetailsModelProps> = ({ visible, onClose, item, onUpdate , }) => {
    const [quantity, setQuantity] = useState(item?.quantity || 1);
    const [price, setPrice] = useState(item?.sellingPrice || 0);
    console.log(item?.quantity ,'items');

    // Reset the form values whenever a new item is selected
    useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
            setPrice(item.sellingPrice);
        }
    }, [item]); // Only run this effect when the `item` changes

    const handleSaves = () => {
        if (item) {
            const updatedItem = {
                ...item, // Spread the existing item to avoid mutating the original
                quantity: Number(quantity),
                sellingPrice: Number(price),
                total: (quantity * price), // Update the total as well
            };
            console.log(updatedItem._id);

            onUpdate(updatedItem); // Send the updated item back to the parent
            onClose(); // Close the modal after saving
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white w-4/5 rounded-lg p-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold">Edit Item Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Item Details */}
                    {item ? (
                        <>
                            <View className="mb-4">
                                <Text className="font-semibold text-black">Name: {item.name}</Text>
                                <Text className="text-gray-500">{item.description}</Text>
                            </View>

                            {/* Editable Fields */}
                            <View className="mb-2">
                                <Text className="text-black font-semibold">Quantity:</Text>
                                <TextInput
                                    value={String(quantity)}
                                    onChangeText={(value) => setQuantity(value)}
                                    keyboardType="numeric"
                                    className="p-2 border border-gray-300 rounded mt-1"
                                />
                            </View>

                            <View className="mb-2">
                                <Text className="text-black font-semibold">Selling Price (₹):</Text>
                                <TextInput
                                    value={String(price)}
                                    onChangeText={(value) => setPrice(value)}
                                    keyboardType="numeric"
                                    className="p-2 border border-gray-300 rounded mt-1"
                                />
                            </View>

                            <View className="mt-4 border-t border-gray-200 pt-2">
                                <Text className="text-black text-lg font-semibold">
                                    Total: ₹{(quantity * price).toFixed(2)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text className="text-center text-gray-500">No item details available.</Text>
                    )}

                    {/* Actions */}
                    <View className="flex-row justify-end mt-4 gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-gray-300 p-3 rounded-lg"
                        >
                            <Text className="text-black">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSaves}
                            className="bg-blue-500 p-3 rounded-lg"
                        >
                            <Text className="text-white">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PurchaseItemDetailsEditModel;
