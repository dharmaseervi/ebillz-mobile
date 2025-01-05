import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

const Paid = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bills from the API
  const fetchBills = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice?paidbills='paid'`);
      const data = await response.json();
      setBills(data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBills();
  }, []);


  return (
    <View className="flex-1 bg-white p-3">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bills.length > 0 ? (
        <FlatList
          data={bills}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Link className='flex-1 ' href={`/purchasePreviews/${item._id}`} >
              <View className="mb-4 w-full p-1 bg-white border-b border-gray-200 ">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-bold text-lg text-gray-800">#{item.invoiceNumber}</Text>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm">{item.invoiceStatus}</Text>
                  </View>
                </View>
                <View className="">
                  <View className="flex-row items-center">
                    <Ionicons name="business-outline" size={16} color="#666" />
                    <Text className="ml-2 text-gray-600">{item.supplierName}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="cash-outline" size={16} color="#666" />
                    <Text className="ml-2 text-gray-600">₹{item.totalAmount}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text className="ml-2 text-gray-600">{new Date(item.purchaseDate).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
            </Link>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className="text-center text-gray-500">No bills available</Text>
      )}
    </View>
  )
}

export default Paid;