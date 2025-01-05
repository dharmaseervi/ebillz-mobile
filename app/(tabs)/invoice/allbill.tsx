import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const Allbill = ({ sortOption }: { sortOption: string }) => {
  const [bill, setBill] = useState([]);
  const router = useRouter();

  // Fetch the invoices
  const fetchInvoice = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice`);
      const data = await res.json();
      setBill(data);
      console.log(data ,'data');
      
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };


  useEffect(() => {
    fetchInvoice();
  }, []);

  // Sorting function for different options
  const sortBills = (bills, option: string) => {
    switch (option) {
      case 'due_amount_asc':
        return bills.sort((a, b) => a.total - b.total);
      case 'due_amount_desc':
        return bills.sort((a, b) => b.total - a.total);
      case 'last_activity_asc':
        return bills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      case 'last_activity_desc':
        return bills.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
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


  useEffect(() => {
    if (sortOption) {
        setBill((prevBill) => sortBills([...prevBill], sortOption));
    }
}, [sortOption]);

  // Handle invoice click
  const handleInvoiceClick = (invoiceId) => {
    router.push({
      pathname: '/(invoice)/[id]',
      params: { id: invoiceId },
    });
  };

  // Get the status color for the invoice status
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
    <ScrollView className="p-2 bg-white">
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
