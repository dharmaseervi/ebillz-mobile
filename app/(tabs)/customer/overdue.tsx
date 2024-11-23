import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';


const Overdue = () => {
  const [overdueUsers, setOverdueUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users with overdue payment status
    const fetchOverdueUsers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/payment?paymentStatus');
        if (!res.ok) {
          throw new Error('Failed to fetch overdue users');
        }
        const data = await res.json();
        setOverdueUsers(data); // Set the data containing overdue users
      } catch (error) {
        console.error('Error fetching overdue users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueUsers();
  }, []);

  console.log(overdueUsers);

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If no overdue users are found
  if (overdueUsers.length === 0) {
    return (
      <View className="p-4 bg-white flex-1">
        <Text className="text-lg text-gray-700">No overdue payments found.</Text>
      </View>
    );
  }

  // Render list of overdue users
  return (
    <View className="p-4 bg-white flex-1">
      <FlatList
        data={overdueUsers}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <View className="p-1 border-b border-gray-300  rounded-lg shadow-md">
            <View className='flex flex-row items-center justify-between'>
              <Text className="text-lg font-semibold text-gray-800">{item.customerId.fullName}</Text>
              <View className='px-2 py-1 rounded-full bg-red-700'>
                <Text className="text-sm text-white  ">{item.paymentStatus}</Text>
              </View>
            </View>
            <Text className="text-sm text-red-600">Amount: {item.payment}</Text>
            <Text className="text-sm text-red-600">dueAmount: {item.payment - item.amountPaid}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Overdue;
