import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const Allbill = () => {
  const [bill, setBill] = useState([]);
  const router = useRouter();

  const fetchInvoice = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invoice');
      const data = await res.json();
      setBill(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const handleInvoiceClick = (invoiceId) => {
    console.log();

    router.push({
      pathname: '/(invoice)/[id]',
      params: { id: invoiceId },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'; // Green for paid
      case 'unpaid':
        return 'text-red-600'; // Red for unpaid
      case 'pending':
        return 'text-yellow-600'; // Yellow for pending
      default:
        return 'text-gray-600'; // Gray for unknown statuses
    }
  };

  return (
    <ScrollView className="p-2">
      {bill?.map((item) => (
        <TouchableOpacity
          key={item._id}
          className="border-b border-gray-300 p-2 mb-2 rounded"
          onPress={() => handleInvoiceClick(item._id)} // Handle click
        >
          <View className="flex flex-row justify-between mb-1">
            <Text className="font-semibold">{item?.customerId?.fullName}</Text>
            <Text className="font-semibold">₹{item?.total}</Text>
          </View>
          <View className="flex flex-row gap-2 mb-1">
            <Text>INV-{item?.invoiceNumber}</Text>
            <Text>{new Date(item?.invoiceDate).toLocaleDateString()}</Text>
          </View>
          <Text className="mb-1">
            Due {new Date(item?.dueDate).toLocaleDateString()}
          </Text>
          {/* Display dynamic status */}
          <Text className={`font-semibold ${getStatusColor(item?.status)}`}>
            {item?.status?.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Allbill;
