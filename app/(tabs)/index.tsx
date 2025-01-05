import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Text, SafeAreaView, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QuickInfo from '../components/home/quickInfo';
import RecentInvoice from '../components/home/recentInvoice';


export default function HomeScreen() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (!initialRender) {
      if (isSignedIn === false) {
        router.replace('/(auth)/sign-in');
      }
    } else {
      setInitialRender(false);
    }
  }, [isSignedIn, router, initialRender]);



  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow mx-2" nestedScrollEnabled>
        {/* Header Section */}
        <View className="px-2 py-2 ">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">
              Welcome, {user?.firstName || 'Guest'}!
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View className="p-2">
          {/* Quick Actions */}
          <View className="flex-row justify-between mb-8 bg-white rounded-lg p-4 border border-gray-300">
            <TouchableOpacity className="flex items-center  p-2 rounded-xl " onPress={() => { router.push('/invoice?modalVisible=true') }}>
              <Ionicons name="add-circle-outline" size={32} color="#4F46E5" />
              <Text className="text-sm font-medium text-gray-700 mt-2">New</Text>
              <Text className='text-sm font-medium text-gray-700'>Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center p-2">
              <Ionicons name="cart-outline" size={32} color="#4F46E5" />
              <Text className="text-sm font-medium text-gray-700 mt-2">Create</Text>
              <Text className="text-sm font-medium text-gray-700 ">Purchase</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex items-center  p-2 " onPress={() => router.push('/(tabs)/invoice/allbill')}>
              <Ionicons name="document-text-outline" size={32} color="#4F46E5" />
              <Text className="text-sm font-medium text-gray-700 mt-2">View</Text>
              <Text className="text-sm font-medium text-gray-700 ">Invoices</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/(tabs)/invoice/${'fsf'}`)} className="flex items-center  p-2 ">
              <Ionicons name="book-outline" size={32} color="#4F46E5" />
              <Text className="text-sm font-medium text-gray-700 mt-2">Create</Text>
              <Text className="text-sm font-medium text-gray-700 ">Ledger</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Info Section */}
          <View className="mb-8 ">
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Quick Info
            </Text>
            <QuickInfo />
          </View>

          {/* Recent Invoices */}
          <View className=''>
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Recent Invoices
            </Text>
            <View className='bg-white pt-2 border border-gray-300 rounded-xl'>
              <RecentInvoice />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

