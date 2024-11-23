import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

const Unpaid = () => {
  const [unpaidBills, setUnpaidBills] = useState([]);

  const fetchUnpaidInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invoice?status=unpaid'); // Adjust endpoint as needed
      const data = await res.json();
      setUnpaidBills(data);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
    }
  };

  useEffect(() => {
    fetchUnpaidInvoices();
  }, []);

  return (
    <View className="p-2">
      {unpaidBills.length > 0 ? (
        unpaidBills.map((item) => (
          <View key={item._id} className="border-b border-gray-300 p-2 mb-2 rounded">
            <View className="flex flex-row justify-between mb-1">
              <Text className="font-semibold">{item?.customerId?.fullName}</Text>
              <Text className="font-semibold">₹{item?.total}</Text>
            </View>
            <View className="flex flex-row gap-2 mb-1">
              <Text>INV-{item?.invoiceNumber}</Text>
              <Text>{new Date(item?.invoiceDate).toLocaleDateString()}</Text>
            </View>
            <Text className="text-red-600">
              Due {new Date(item?.dueDate).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-600 text-center">No unpaid invoices found.</Text>
      )}
    </View>
  );
};

export default Unpaid;
