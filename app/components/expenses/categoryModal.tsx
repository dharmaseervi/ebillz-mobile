import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';

interface Category {
    _id: string;
    name: string;
}

interface ExpenseCategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectCategory: (category: Category) => void;
}
const predefinedCategories = [
    { _id: '1', name: "Advertising" },
    { _id: '2', name: "Bank Fees" },
    { _id: '3', name: "Business Meals" },
    { _id: '4', name: "Client Gifts" },
    { _id: '5', name: "Continuing Education" },
    { _id: '6', name: "Depreciation" },
    { _id: '7', name: "Employee Benefits" },
    { _id: '8', name: "Insurance" },
    { _id: '9', name: "Legal and Professional Expenses" },
    { _id: '10', name: "Maintenance and Repairs" },
    { _id: '11', name: "Office Expenses and Supplies" },
    { _id: '12', name: "Postage and Shipping" },
    { _id: '13', name: "Printing" },
    { _id: '14', name: "Rent" },
    { _id: '15', name: "Salaries and Wages" },
    { _id: '16', name: "Software" },
    { _id: '17', name: "Telephone" },
    { _id: '18', name: "Travel" },
    { _id: '19', name: "Utilities" },
    { _id: '20', name: "Vehicle Expenses" },
    { _id: '21', name: "Licenses and Permits" },
    { _id: '23', name: "Charitable Contributions" },
    { _id: '24', name: "Medical Expenses" },
    { _id: '25', name: "Real Estate Taxes" },
];


const ExpenseCategoryModal: React.FC<ExpenseCategoryModalProps> = ({ isVisible, onClose, onSelectCategory }) => {
    const [categories, setCategories] = useState<Category[]>(predefinedCategories);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);

    console.log(categories);

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/expenses-category`);
            const data = await response.json();
            if (response.ok) {
                setCategories([...predefinedCategories, ...data.categories]);

            } else {
                Alert.alert('Error', data.error || 'Failed to fetch categories');
            }
        } catch (error) {
            console.log(error);

        }
    };

    // Add new category
    const addCategory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/expenses-category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory }),
            });
            const data = await response.json();
            Alert.alert('Success', 'Category added successfully');
            setNewCategory('');
            fetchCategories(); // Refresh categories

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (isVisible) fetchCategories();
    }, [isVisible]);

    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            className="px-4 py-3 border-b border-gray-300 rounded-xl mb-2 hover:bg-gray-700"
            onPress={() => {
                onSelectCategory(item);
                onClose();
            }}
        >
            <Text className="text-base text-black">{item?.name}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white pt-14 mb-10">
                <View className="rounded-lg p-5">
                    {/* Modal Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-semibold text-black">Select Expense Category</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-2xl text-black">×</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Add New Category */}
                    <View className="mb-4">
                        <TextInput
                            className="border border-gray-300 p-2 rounded-lg mb-2"
                            placeholder="Add new category"
                            value={newCategory}
                            onChangeText={setNewCategory}
                        />
                        <TouchableOpacity
                            className="bg-blue-700 p-2 rounded-lg"
                            onPress={addCategory}
                            disabled={loading}
                        >
                            <Text className="text-white text-center">{loading ? 'Adding...' : 'Add Category'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Categories List */}
                    <View className='bg-gray-200 rounded-xl h-3/4'>
                        <FlatList
                            data={categories}
                            renderItem={renderItem}
                            keyExtractor={(item) => item?._id}
                            className="flex-grow"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ExpenseCategoryModal;
