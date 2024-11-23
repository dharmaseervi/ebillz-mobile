import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

const RecentInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/recent-invoice'); // Replace with your API URL
                const data = await response.json();
                setInvoices(data); // Assuming the API returns an array of invoices
            } catch (error) {
                console.error('Failed to fetch invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text>Loading recent invoices...</Text>
            </View>
        );
    }

    return (
        <View className="">
            <FlatList
                data={invoices}
                keyExtractor={(item) => item._id.toString()} // Ensure `id` exists in your data
                renderItem={({ item }) => (
                    <View className="bg-white  mb-4 rounded-lg border-b border-gray-300  flex-row justify-between items-center">
                        <View>
                            <Text className="text-lg font-semibold text-gray-800">{item.customerId.fullName}</Text>
                            <Text className="text-sm text-gray-500">Invoice No: {item.invoiceNumber}</Text>
                            <Text className="text-sm text-gray-500"> Date: {new Date(item.invoiceDate).toLocaleDateString()}</Text>
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-indigo-600">₹{item.total}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text className="text-center text-gray-500">No recent invoices found.</Text>}
            />
        </View>
    );
};

export default RecentInvoice;
