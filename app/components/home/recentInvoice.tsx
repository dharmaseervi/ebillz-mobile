import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RecentInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recent-invoice`);
                const data = await response.json();
                setInvoices(data);
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
            <View className="flex-1 justify-center items-center p-4">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="mt-2 text-gray-600">Loading recent invoices...</Text>
            </View>
        );
    }

    const handleInvoiceClick = (invoiceId) => {
        router.push({
            pathname: '/(invoice)/[id]',
            params: { id: invoiceId },
        });
    };

    return (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {invoices.length > 0 ? (
                invoices.map((item) => (
                    <View key={item._id} className="mb-4">
                        <TouchableOpacity
                            onPress={() => handleInvoiceClick(item._id)}
                            className="rounded-xl border-b border-gray-300 p-3"
                        >
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-800">{item.customerId.fullName}</Text>
                                    <Text className="text-sm text-gray-500">Invoice No: {item.invoiceNumber}</Text>
                                    <Text className="text-sm text-gray-500">Date: {new Date(item.invoiceDate).toLocaleDateString()}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-lg font-bold text-indigo-600 mr-2">
                                        ₹{item.total.toLocaleString()}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <View className="flex-1 justify-center items-center p-4">
                    <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                    <Text className="text-center text-gray-500 mt-2">No recent invoices found.</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default RecentInvoice;
