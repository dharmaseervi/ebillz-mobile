import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const Unpaid = ({ sortOption }: { sortOption: string }) => {
  const router = useRouter();
  const [unpaidBills, setUnpaidBills] = useState([]);

  // Fetch unpaid invoices
  const fetchUnpaidInvoices = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice?status=unpaid`); // Adjust endpoint as needed
      const data = await res.json();
      setUnpaidBills(data);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
    }
  };

  useEffect(() => {
    fetchUnpaidInvoices();
  }, []);

  // Sorting function
  const sortBills = (bills, option) => {
    switch (option) {
      case 'due_amount_asc':
        return bills.sort((a, b) => a.total - b.total);
      case 'due_amount_desc':
        return bills.sort((a, b) => b.total - a.total);
      case 'last_activity_asc':
        return bills.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
      case 'last_activity_desc':
        return bills.sort(
          (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
        );
      case 'name_asc':
        return bills.sort((a, b) =>
          a.customerId?.fullName.localeCompare(b.customerId?.fullName)
        );
      case 'name_desc':
        return bills.sort((a, b) =>
          b.customerId?.fullName.localeCompare(a.customerId?.fullName)
        );
      default:
        return bills;
    }
  };

  // Apply sorting whenever `sortOption` changes
  useEffect(() => {
    if (sortOption) {
      setUnpaidBills((prevBills) => sortBills([...prevBills], sortOption));
    }
  }, [sortOption]);

  // Handle navigation
  const handleInvoiceClick = (invoiceId) => {
    router.push({
      pathname: '/(invoice)/[id]',
      params: { id: invoiceId },
    });
  };

  return (
    <ScrollView className="p-2 bg-white">
      {unpaidBills.length > 0 ? (
        unpaidBills.map((item) => (
          <TouchableOpacity
            onPress={() => handleInvoiceClick(item._id)}
            key={item._id}
            className="border-b border-gray-300 p-2 mb-2 rounded"
          >
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
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-gray-600 text-center">No unpaid invoices found.</Text>
      )}
    </ScrollView>
  );
};

export default Unpaid;
