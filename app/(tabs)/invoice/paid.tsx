import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

const Paid = () => {
  const [paidBills, setPaidBills] = useState([]);

  const fetchPaidInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invoice?status=paid'); // Adjust the endpoint if needed
      const data = await res.json();
      setPaidBills(data);
    } catch (error) {
      console.error('Error fetching paid invoices:', error);
    }
  };

  useEffect(() => {
    fetchPaidInvoices();
  }, []);

  return (
    <View className="p-2">
      {paidBills.length > 0 ? (
        paidBills.map((item) => (
          <View key={item._id} className="border-b border-gray-300 p-2 mb-2 rounded">
            <View className="flex flex-row justify-between mb-1">
              <Text className="font-semibold">{item?.customerId?.fullName}</Text>
              <Text className="font-semibold">₹{item?.total}</Text>
            </View>
            <View className="flex flex-row gap-2 mb-1">
              <Text>INV-{item?.invoiceNumber}</Text>
              <Text>{new Date(item?.invoiceDate).toLocaleDateString()}</Text>
            </View>
            <Text className="text-green-600">Paid on {new Date(item?.paymentDate).toLocaleDateString()}</Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-600 text-center">No paid invoices found.</Text>
      )}
    </View>
  );
};

export default Paid;
