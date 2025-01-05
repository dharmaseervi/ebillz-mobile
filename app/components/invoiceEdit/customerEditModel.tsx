import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Customer {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
}

const EditCustomerModal = ({
    setCustomerModalVisible,
    visible,
    onClose,
    setCustomerId,
    selectedCustomerId
}: any) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(''); // State to hold search input
    const [currentSelectedId, setCurrentSelectedId] = useState<string | null>(null);

    // Fetch customers from the API
    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/customer`);
            const data = await res.json();
            if (data) {
                setCustomers(data.customers);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Fetching error: ' + error);
        }
    };
 
    console.log(customers,'cus mo');
    

    
    // Handle customer selection
    const handleSelectCustomer = (id: string) => {
        setCurrentSelectedId(id); // Update local state
        setCustomerId(id); // Update parent state
        setTimeout(() => {
            setCustomerModalVisible(false); // Close modal
        }, 200);
    };


    useEffect(() => {
        if (visible) {
            fetchCustomers();
    
            // Sync currentSelectedId with selectedCustomerId
            if (selectedCustomerId) {
                console.log("Setting currentSelectedId to selectedCustomerId:", selectedCustomerId);
                setCurrentSelectedId(selectedCustomerId);
            } else {
                console.log("No selectedCustomerId. Clearing currentSelectedId.");
                setCurrentSelectedId(null);
            }
        }
    }, []);
    

    // Filter customers based on the search term
    const filteredCustomers = customers.filter(customer =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // Handle back button on Android
        >
            <View className="flex-1 pt-16 bg-gray-100">
                <View className="flex flex-row justify-between items-center w-full px-4 py-2">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-blue-600">Close</Text>
                    </TouchableOpacity>
                    <Text className="text-lg text-black">Select Customer</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-blue-600">Done</Text>
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View className="px-4 py-2">
                    <TextInput
                        placeholder="Search by name, email, or phone"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="bg-gray-200 p-2 rounded"
                    />
                </View>

                {/* Customer list */}
                <ScrollView className="my-4 px-4 flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                    <View className="bg-gray-200 rounded-lg p-4">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map(customer => (
                                <TouchableOpacity
                                    key={customer._id}
                                    onPress={() => handleSelectCustomer(customer._id)}
                                >
                                    <View
                                        className={`border-b border-gray-300 mb-2 p-2 ${currentSelectedId === customer._id
                                            ? 'bg-green-600 rounded-lg '
                                            : ''
                                            }`}
                                    >
                                        <Text className={`${currentSelectedId === customer._id
                                            ? ' text-lg text-white '
                                            : 'text-lg text-black'}`}>{customer.fullName}</Text>
                                        <Text className="text-sm text-gray-600">{customer.email}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text className="text-center text-gray-600">No customers found</Text>
                        )}
                    </View>
                </ScrollView>
            </View >
        </Modal >
    );
};

export default EditCustomerModal;
