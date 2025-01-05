import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';
import ExpenseCategoryModal from './categoryModal';

const ExpensesModel = ({ visible, onClose }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ name: 'select' });
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [note, setNote] = useState('');

    const handleInvoiceDateChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const addExpense = async () => {
        if (!amount || !selectedCategory?.name || selectedCategory?.name === 'select') {
            alert('Please fill all required fields!');
            return;
        }

        const expense = {
            date,
            category: selectedCategory?.name,
            amount: parseFloat(amount),
            reference,
            notes: note,
        };

        console.log(expense);

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            const data = await response.json();
            if (data.success) {
                console.log('Expense added:', data.Expense);
                onClose(); // Close the modal after a successful save
            } else {
                console.error('Error adding expense:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View>
            <Modal
                onRequestClose={onClose}
                visible={visible}
                animationType="slide"
            >
                <View className="pt-16">
                    <View className="flex-row justify-between px-4 items-center">
                        <TouchableOpacity onPress={() => onClose(false)}>
                            <Text className="text-xl text-indigo-600">Close</Text>
                        </TouchableOpacity>
                        <View>
                            <Text>Add Expenses</Text>
                        </View>
                        <TouchableOpacity onPress={addExpense}>
                            <Text className="text-xl text-indigo-600">Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-5 px-4">
                        <View className="bg-gray-100 rounded-xl p-3">
                            {/* Date Picker */}
                            <View className="flex-row justify-between border-b border-gray-200 mb-2">
                                <Text className="text-xl">Date</Text>
                                <View className="flex-row items-center gap-1">
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <Text>{date.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                    <FontAwesome name="angle-right" size={20} />
                                </View>
                                <DateTimePickerModal
                                    isVisible={showDatePicker}
                                    mode="date"
                                    onConfirm={handleInvoiceDateChange}
                                    onCancel={() => setShowDatePicker(false)}
                                />
                            </View>

                            {/* Category Picker */}
                            <View className="flex-row justify-between border-b border-gray-200 mb-2">
                                <View>
                                    <Text className="text-xl">Category</Text>
                                    <ExpenseCategoryModal
                                        isVisible={modalVisible}
                                        onClose={() => setModalVisible(false)}
                                        onSelectCategory={handleSelectCategory}
                                    />
                                </View>
                                <TouchableOpacity
                                    className="flex-row items-center gap-1"
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text className="text-lg">
                                        {selectedCategory?.name}
                                    </Text>
                                    <FontAwesome name="angle-right" size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View className="bg-gray-100 mt-5 p-3 rounded-xl">
                            <View className="flex-row justify-between">
                                <Text>Amount</Text>
                                <TextInput
                                    placeholder="INR"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    className=""
                                />
                            </View>
                        </View>

                        {/* Reference and Notes */}
                        <View className="bg-gray-100 mt-5 p-3 rounded-xl">
                            <View className="flex-row justify-between border-b border-gray-200 py-2 mb-2">
                                <Text>Reference</Text>
                                <TextInput
                                    placeholder="Tap to Enter"
                                    value={reference}
                                    onChangeText={setReference}
                                    className=""
                                />
                            </View>
                            <View className="gap-2">
                                <Text>Notes</Text>
                                <TextInput
                                    className="border border-gray-200 h-32 p-1"
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Type your message here"
                                    placeholderTextColor="#aaa"
                                    textAlignVertical="top"
                                    value={note}
                                    onChangeText={setNote}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ExpensesModel;
