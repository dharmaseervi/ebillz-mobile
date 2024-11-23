import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
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

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow">
        {/* Header Section */}
        <View className="px-6 py-8 rounded-b-3xl ">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-black">
              Welcome, {user?.firstName || 'Guest'}!
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-black rounded-full px-3 py-2"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="">

          <View className="">
            <View className=" rounded-lg px-3 flex flex-row justify-between items-center">
              {/* Action Card: New Invoice */}
              <TouchableOpacity  className="flex items-center">
                <Ionicons name="add-circle-outline" size={32} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 mt-2">New Invoice</Text>
              </TouchableOpacity>

              {/* Action Card: Create Purchase */}
              <TouchableOpacity className="flex items-center">
                <Ionicons name="cart-outline" size={32} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 mt-2">Create Purchase</Text>
              </TouchableOpacity>

              {/* Action Card: View Invoices */}
              <TouchableOpacity className="flex items-center">
                <Ionicons name="document-text-outline" size={32} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 mt-2">View Invoices</Text>
              </TouchableOpacity>

              {/* Action Card: Create Ledger */}
              <TouchableOpacity  onPress={() => router.push(`/(tabs)/invoice/${'fsf'}`)} className="flex items-center">
                <Ionicons name="book-outline" size={32} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 mt-2">Create Ledger</Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* Quick Info Section */}
          <View className="bg-white border rounded-xl p-3 m-5">
            <Text className="text-lg font-semibold text-gray-800 p-2">
              Quick Info
            </Text>
            <QuickInfo />
          </View>

          {/* Recent Invoices */}
          <View className="bg-white border rounded-xl  p-3 m-5">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Recent Invoices
            </Text>
            <RecentInvoice />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
