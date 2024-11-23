import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native'; // Import SafeAreaView
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import AddCustomerButton from '@/app/components/customer/addcustomer';
import Overdue from './overdue';
import Unpaid from './unpaid';
import Active from './active';

const TopTab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <SafeAreaView className='flex-1 bg-white' >
      <View className='flex flex-row justify-between items-center px-5 mb-3'>
        <Text className='text-2xl font-medium '>Customer</Text>
        <View className='flex flex-row items-center gap-4'>
          <MaterialCommunityIcons name="sort" size={24} color="black" />
          <FontAwesome name="search" size={24} color="black" />
        </View>
      </View>
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#03c6fc' },
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        <TopTab.Screen name="active" component={Active} />
        <TopTab.Screen name="unpaid" component={Unpaid} />
        <TopTab.Screen name="overdue" component={Overdue} />
      </TopTab.Navigator>

      <View className='absolute bottom-0 right-4  '>
        <AddCustomerButton setModalVisible={setModalVisible} modalVisible={modalVisible} />
      </View>
    </SafeAreaView>
  );
};

export default TopTabNavigator;
