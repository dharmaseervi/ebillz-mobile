import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';

const More = () => {
  const router = useRouter();
  const { signOut } = useAuth();

  const options = [
    { 
      label: 'Profile', 
      icon: 'person-outline', 
      description: 'Manage your personal details and preferences.', 
      action: () => router.push('/components/profile/profile') 
    },
    { 
      label: 'Company Settings', 
      icon: 'settings-outline', 
      description: 'Update company information and settings.', 
      action: () => router.push('/(company)/CreateCompany') 
    },
    { 
      label: 'Notifications', 
      icon: 'notifications-outline', 
      description: 'View recent notifications and alerts.', 
      action: () => console.log('Navigate to Notifications') 
    },
    { 
      label: 'Contact Support', 
      icon: 'help-circle-outline', 
      description: 'Get help and support for the app.', 
      action: () => console.log('Navigate to Contact Support') 
    },
    { 
      label: 'Purchase Invoices', 
      icon: 'document-outline', 
      description: 'View all your purchase invoices.', 
      action: () => router.push('/(purchase)/allbill') 
    },
    { 
      label: 'Log Out', 
      icon: 'log-out-outline', 
      description: 'Sign out from your account.', 
      action: () => handleLogout() 
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView  className=''>
        {/* Header */}
        <View className="mb-6 px-4 ">
          <Text className="text-2xl font-bold text-gray-800">More Options</Text>
          <Text className="text-sm text-gray-500">
            Manage your profile, settings, and app preferences.
          </Text>
        </View>

        {/* Options List */}
        <View className=" rounded-xl">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={option.action}
              className={`flex-row items-center justify-between p-4 ${
                index !== options.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons 
                  name={option.icon} 
                  size={28} 
                  color="#4F46E5" 
                  style={{ marginRight: 12 }} 
                />
                <View>
                  <Text className="text-lg font-medium text-gray-800">{option.label}</Text>
                  {option.description && (
                    <Text className="text-sm text-gray-500">{option.description}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#4F46E5" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default More;
