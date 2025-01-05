import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const Paid = ({ sortOption }: { sortOption: string }) => {
  const [paidBills, setPaidBills] = useState([]);
  const router = useRouter();

  // Fetch paid invoices
  const fetchPaidInvoices = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice?status=paid`);
      const data = await res.json();
      setPaidBills(data);
    } catch (error) {
      console.error('Error fetching paid invoices:', error);
    }
  };

  useEffect(() => {
    fetchPaidInvoices();
  }, []);

  // Sorting function (shared logic)
  const sortBills = (bills, option: string) => {
    switch (option) {
      case 'due_amount_asc':
        return bills.sort((a, b) => a.total - b.total);
      case 'due_amount_desc':
        return bills.sort((a, b) => b.total - a.total);
      case 'last_activity_asc':
        return bills.sort(
          (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)
        );
      case 'last_activity_desc':
        return bills.sort(
          (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
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
      setPaidBills((prevBills) => sortBills([...prevBills], sortOption));
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
      {paidBills.length > 0 ? (
        paidBills.map((item) => (
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
            <Text className="text-green-600">
              Paid on {new Date(item?.paymentDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-gray-600 text-center">No paid invoices found.</Text>
      )}
    </ScrollView>
  );
};

export default Paid;
