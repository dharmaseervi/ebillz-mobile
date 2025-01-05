import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

interface Invoice {
  _id: string;
  customerId: {
    fullName: string;
  };
  invoiceNumber: string;
  dueAmount: number;
  dueDate: string;
  total: number;
}

const Unpaid = ({ sortOption }: { sortOption: string }) => {
  const [loading, setLoading] = useState(true);
  const [unpaidBills, setUnpaidBills] = useState<Invoice[]>([]);

  const fetchUnpaidInvoices = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API URL not defined in environment variables');

      const res = await fetch(`${apiUrl}/invoice?status=unpaid`);
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

  const sortInvoices = (invoices: Invoice[], option: string): Invoice[] => {
    const sortedInvoices = [...invoices];
    switch (option) {
      case 'due_amount_asc':
        return sortedInvoices.sort((a, b) => a.total - b.total);
      case 'due_amount_desc':
        return sortedInvoices.sort((a, b) => b.total - a.total);
      case 'due_date_asc':
        return sortedInvoices.sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      case 'due_date_desc':
        return sortedInvoices.sort(
          (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );
      case 'name_asc':
        return sortedInvoices.sort((a, b) =>
          a.customerId.fullName.localeCompare(b.customerId.fullName)
        );
      case 'name_desc':
        return sortedInvoices.sort((a, b) =>
          b.customerId.fullName.localeCompare(a.customerId.fullName)
        );
      default:
        return sortedInvoices;
    }
  };

  useEffect(() => {
    if (sortOption) {
      setUnpaidBills((prevInvoices) => sortInvoices(prevInvoices, sortOption));
    }
  }, [sortOption]);

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
    <View className="flex-1 bg-white px-2 ">
      <FlatList
        data={unpaidBills}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="p-3 mb-4 border-b border-gray-200 rounded-xl">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  {item.customerId?.fullName || 'Unknown'}
                </Text>
                <Text className="text-sm text-gray-500">Invoice No: {item.invoiceNumber}</Text>
                <Text className="text-sm font-semibold text-red-600">
                  Amount Due: ₹{item.total || 0}
                </Text>
              </View>
              <View className="flex gap-2">
                <Text className="text-sm text-gray-500">
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                </Text>
                <Text className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  Unpaid
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Unpaid;
