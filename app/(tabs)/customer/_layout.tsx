import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import AddCustomerButton from '@/app/components/customer/addcustomer';
import Overdue from './overdue';
import Unpaid from './unpaid';
import Active from './active';
import SearchModel from '@/app/components/searchModel';
import SortModel from '@/app/components/sortModel';
const TopTab = createMaterialTopTabNavigator();


const TopTabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false); // For Add Customer Modal
  const [searchModalVisible, setSearchModalVisible] = useState(false); // For Search Modal
  const [sortModalVisible, setSortModalVisible] = useState(false); // For Sort Modal
  const [sortOption, setSortOption] = useState(''); // Sorting Preferences

  // Handle Sorting Preferences
  const handleSort = (option) => {
    setSortOption(option); // Set the selected sort option
    setSortModalVisible(false); // Close Sort Modal
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex flex-row justify-between items-center px-5 mb-3'>
        <Text className='text-2xl font-medium'>Customer</Text>
        <View className='flex flex-row items-center gap-4'>
          <TouchableOpacity onPress={() => setSortModalVisible(true)}>
            <MaterialCommunityIcons name="sort" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Tabs */}
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#03c6fc' },
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        {/* <TopTab.Screen name="active" component={() => <Active sortOption={sortOption} />} /> */}
        <TopTab.Screen name="active">
          {() => <Active sortOption={sortOption} />}
        </TopTab.Screen>

        <TopTab.Screen name="unpaid" >
          {() => <Unpaid sortOption={sortOption} />}
        </TopTab.Screen>
        <TopTab.Screen name="overdue" >
          {() => <Overdue sortOption={sortOption} />}
        </TopTab.Screen>
      </TopTab.Navigator>

      {/* Add Customer Button */}
      <View className='absolute bottom-0 right-4'>
        <AddCustomerButton setModalVisible={setModalVisible} modalVisible={modalVisible} />
      </View>

      <SearchModel visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} searchType={'customer'} />

      {/* Sort Modal */}
      <SortModel onSort={handleSort} visible={sortModalVisible} onClose={() => setSortModalVisible(false)} />
    </SafeAreaView>
  );
};

export default TopTabNavigator;
