import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const QuickInfo = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuickInfo = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/quick-info?dateFilter=last7days');
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

    if (loading) return <ActivityIndicator size="large" color="#4F46E5" />;

    return (
        <View className="p-2">
            <View className="border p-4 rounded-lg mb-4">
                <Text className="text-lg font-semibold">Invoices Generated: {data.numInvoices}</Text>
                <Text>Total Amount: ₹{data.totalInvoiceAmount?.toLocaleString()}</Text>
            </View>
            <View className="border p-4 rounded-lg mb-4">
                <Text className="text-lg font-semibold">Payments Collected: ₹{data.totalPaymentsCollected.toLocaleString()}</Text>
            </View>
            <View className="border p-4 rounded-lg mb-4">
                <Text className="text-lg font-semibold">Pending Invoices: {data.numPendingInvoices}</Text>
            </View>
            <View className="border p-4 rounded-lg">
                <Text className="text-lg font-semibold">Last 7 Days Collections:</Text>
                {data.last7DaysCollections.map((day) => (
                    <Text key={day._id}>
                        {day._id}: ₹{day.totalCollected.toLocaleString()}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export default QuickInfo;
