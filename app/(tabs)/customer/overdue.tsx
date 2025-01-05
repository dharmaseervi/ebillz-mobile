import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

const Overdue = ({ sortOption }: { sortOption: string }) => {
  const [overdueUsers, setOverdueUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState([]);

  useEffect(() => {
    const fetchOverdueUsers = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payment?paymentStatus`);
        if (!res.ok) {
          throw new Error('Failed to fetch overdue users');
        }
        const data = await res.json();
        setOverdueUsers(data);
        console.log(overdueUsers, 'over');

      } catch (error) {
        console.error('Error fetching overdue users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueUsers();
  }, []);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice?id=${overdueUsers[0]?.invoiceId}`);
        if (!res.ok) throw new Error('Failed to fetch invoice details');
        const data = await res.json();
        console.log(data, 'overdue');

        setInvoice(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (overdueUsers.length > 0) fetchInvoiceDetails();
  }, [overdueUsers]);

  // Sorting logic based on sortOption prop
  const sortedUsers = [...overdueUsers].sort((a, b) => {
    if (sortOption === 'name_asc') {
      return a.customerId.fullName.localeCompare(b.customerId.fullName);
    }
    if (sortOption === 'name_desc') {
      return b.customerId.fullName.localeCompare(a.customerId.fullName);
    }
    if (sortOption === 'due_amount_asc') {
      const dueA = invoice.total - a.amountPaid;
      const dueB = invoice.total - b.amountPaid;
      return dueA - dueB;
    }
    if (sortOption === 'due_amount_desc') {
      const dueA = invoice.total - a.amountPaid;
      const dueB = invoice.total - b.amountPaid;
      return dueB - dueA;
    }
    return 0; // Default no sorting
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (overdueUsers.length === 0) {
    return (
      <View className="p-4 bg-white flex-1">
        <Text className="text-lg text-gray-700">No overdue payments found.</Text>
      </View>
    );
  }

  return (
    <View className="p-3 bg-white flex-1">
      <FlatList
        data={sortedUsers}
        keyExtractor={(item) => item?._id?.toString()}
        renderItem={({ item }) => (
          <View className="p-1 border-b border-gray-300 rounded-lg">
            <View className="flex-row justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-800">{item.customerId.fullName}</Text>
                <Text className="text-sm text-gray-600">Amount: {invoice.total}</Text>
                <Text className="text-sm text-gray-700">
                  Due Amount: {invoice.total - item.amountPaid}
                </Text>
              </View>
              <View className="flex justify-center items-center">
                <Text className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                  {item.paymentStatus}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Overdue;
