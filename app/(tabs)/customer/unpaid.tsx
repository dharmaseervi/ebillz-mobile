import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

const Unpaid = () => {
  const [loading, setLoading] = useState(true);
  const [unpaidBills, setUnpaidBills] = useState([]);

  const fetchUnpaidInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invoice?status=unpaid'); // Adjust endpoint as needed
      const data = await res.json();
      setUnpaidBills(data);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnpaidInvoices();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (unpaidBills.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-lg text-gray-600">No unpaid invoices found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-2 ">
      <FlatList
        data={unpaidBills}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-3 mb-4  border-b border-gray-200 rounded-xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">
                {item.customerId?.fullName || 'Unknown'}
              </Text>
              <Text className="text-sm text-gray-500">
                {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <Text className="text-sm text-gray-500 ">Invoice ID: {item.invoiceId}</Text>
            <Text className="text-lg font-semibold text-red-600 ">
              Amount Due: ₹{item.total || 0}
            </Text>
            <View className="flex-row mt-1">
              <Text className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                Unpaid
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Unpaid;
