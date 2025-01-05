import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuickInfo = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/quick-info?dateFilter=last7days`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching quick info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuickInfo();
    }, []);

    if (loading) return (
        <View className="flex-1 justify-center items-center p-4">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-2 text-gray-600">Loading quick info...</Text>
        </View>
    );

    return (
        <View className="p-2 bg-white rounded-lg border border-gray-300 ">
            <View className=" mb-4 p-4 border-b border-gray-300 flex-row justify-between">
                <View className="gap-2">
                    <View className='flex-row'>
                        <Ionicons name="document-text" size={24} color="#4F46E5" />
                        <Text className="text-lg font-semibold ml-2">Invoices Generated</Text>
                    </View>
                    <Text className="text-sm text-gray-600">Total: ₹{data?.totalInvoiceAmount?.toLocaleString()}</Text>
                </View>
                <View>
                    <Text className="text-3xl font-bold text-gray-800">{data?.numInvoices}</Text>
                </View>
            </View>

            <View className="mb-4 p-4 border-b border-gray-300 flex-row justify-between">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="cash" size={24} color="#4F46E5" />
                    <Text className="text-lg font-semibold ml-2">Payments Collected</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-800">₹{data?.totalPaymentsCollected.toLocaleString()}</Text>
            </View>

            <View className=" mb-4 p-4 border-b border-gray-300 flex-row justify-between">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="hourglass" size={24} color="#4F46E5" />
                    <Text className="text-lg font-semibold ml-2">Pending Invoices</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-800">{data?.numPendingInvoices}</Text>
            </View>

            <View className="p-4">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar" size={24} color="#4F46E5" />
                    <Text className="text-lg font-semibold ml-2">Last 7 Days Collections</Text>
                </View>
                {data?.last7DaysCollections?.map((day) => (
                    <View key={day._id} className="flex-row justify-between items-center py-2 border-b border-gray-200">
                        <Text className="text-gray-600">{day._id}</Text>
                        <Text className="font-semibold">₹{day.totalCollected.toLocaleString()}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default QuickInfo;
