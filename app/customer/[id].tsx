import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomerEditModal from './customerEditModal';

export default function CustomerDetails() {
  const { id } = useLocalSearchParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For editing

  const router = useRouter();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/customer?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch customer details');
        const data = await res.json();
        setCustomer(data.customer);
      } catch (err) {
        setError('Failed to fetch customer details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomerDetails();
  }, [id]);

  const handleDeleteCustomer = async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/customer?id=${customer._id}`, // Pass the ID as a query parameter
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Customer deleted successfully:", data.message);
        // Optionally refresh customer list or navigate away
      } else {
        console.error("Failed to delete customer:", data.error);
        alert(data.error); // Show error to the user
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-lg text-gray-600">Loading customer details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="mt-2 text-2xl text-red-500 text-center">{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-5 py-2 px-5 bg-blue-500 rounded-lg">
          <Text className="text-white text-lg font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className='bg-gray-800 flex-1'>

      {/* Header Section */}
      <View className="flex-row items-center px-2 py-2 bg-gray-800  border-gray-200">
        <TouchableOpacity onPress={() => router.push('/(tabs)/customer')} className="mr-4">
          <Feather name="arrow-left" size={24} color="#3B82F6" />
        </TouchableOpacity>
        {/* <Text className="text-xl font-semibold text-gray-800">Customer Details</Text> */}
      </View>

      {/* Customer Profile */}
      <View className="p-2 flex justify-center items-center bg-gray-800">
        <View className="w-16 flex  h-16 rounded-full bg-blue-500 justify-center items-center mb-2">
          <Text className="text-3xl font-bold text-white">{customer?.fullName?.charAt(0)}</Text>
        </View>
        <Text className="text-2xl font-semibold text-white">{customer?.fullName}</Text>
        {/* Customer Communication Options */}
        <View className="flex-row w-full  flex justify-between mt-6  p-4 rounded-lg">
          <TouchableOpacity className="items-center" onPress={() => console.log('Call')}>
            <FontAwesome name="phone" size={20} color="#3B82F6" />
            <Text className="mt-2 text-sm text-blue-500">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => console.log('Message')}>
            <FontAwesome name="comment" size={20} color="#3B82F6" />
            <Text className="mt-2 text-sm text-blue-500">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center" onPress={() => console.log('Email')}>
            <FontAwesome name="envelope" size={20} color="#3B82F6" />
            <Text className="mt-2 text-sm text-blue-500">Email</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="bg-gray-100">
        {/* Action Buttons (Edit/Delete) */}
        <View className="flex-row justify-between  p-2">
          <TouchableOpacity
            onPress={() => {
              setSelectedCustomer(customer);
              setEditModalVisible(true);
            }}
            className="flex-row items-center justify-center py-3 px-6 bg-blue-500 rounded-lg flex-1 mr-2"
          >
            <Feather name="edit-2" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteCustomer} className="flex-row items-center justify-center py-3 px-6 bg-red-500 rounded-lg flex-1 ml-2">
            <MaterialIcons name="delete-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Delete</Text>
          </TouchableOpacity>
        </View>


        {/* Customer Information */}
        <View className="bg-white p-3 mt-2 rounded-lg">
          <View className="flex-row items-center mb-3 gap-2">
            <Feather name="mail" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-lg text-gray-600">{customer?.email}</Text>
          </View>
          <View className="flex-row items-center mb-3 gap-2">
            <Feather name="phone" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-lg text-gray-600">{customer?.phone}</Text>
          </View>
          <View className="flex-row items-center mb-3 gap-2">
            <Feather name="map-pin" size={20} color="#4B5563" className="mr-3" />
            <Text className="text-lg text-gray-600">{customer?.address}, {customer?.city}, {customer?.state} - {customer?.zip}</Text>
          </View>
        </View>

        <CustomerEditModal
          modalVisible={editModalVisible}
          setModalVisible={setEditModalVisible}
          customerData={customer} // Pass the customer to edit

        />
      </ScrollView>
    </SafeAreaView>
  );
}
