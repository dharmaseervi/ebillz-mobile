import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import SupplierFormModal from './supplierFormModal';

const SupplierModal = ({ visible, onClose, onSupplierSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [supplierFormVisible, setSupplierFormVisible] = useState(false);


    // Fetch suppliers from backend
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/supplier`); // Replace with your API endpoint
                const data = await response.json();
                console.log(data, 'data');

                setSuppliers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            }
        };

        if (visible) fetchSuppliers();
    }, [visible]);

    // Filter suppliers based on search term
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim()) {
            const filtered = suppliers.filter((supplier) =>
                supplier.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        } else {
            setFilteredSuppliers([]);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-white pt-16 px-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold">Select Supplier</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-blue-600 text-lg">Close</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className='flex-row justify-between items-center gap-2' >
                    <TextInput
                        value={searchTerm}
                        onChangeText={handleSearch}
                        placeholder="Search Suppliers..."
                        className="border border-gray-300 rounded-lg p-3 flex-1"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSupplierFormVisible(true);
                        }}
                        className=" rounded-lg p-3 border border-gray-300"
                    >
                        <Text className="text-center text-black font-medium">+</Text>
                    </TouchableOpacity>
                </View>

                {/* Loading Indicator */}
                {loading && (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#03c6fc" />
                    </View>
                )}

                {/* Supplier List */}
                {!loading && (
                    <FlatList
                        data={
                            filteredSuppliers.length > 0
                                ? filteredSuppliers
                                : suppliers
                        }
                        keyExtractor={(item) => item._id.toString()}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center mt-8">
                                <Text className="text-gray-600">No suppliers found.</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    onSupplierSelect(item);
                                    onClose(); // Close modal
                                }}
                                className="border-b border-gray-200 p-2"
                            >
                                <Text className="text-gray-800">{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

                {/* Add Supplier Button */}


                <SupplierFormModal visible={supplierFormVisible} onClose={() => { setSupplierFormVisible(false) }} />
            </View>
        </Modal>
    );
};

export default SupplierModal;
