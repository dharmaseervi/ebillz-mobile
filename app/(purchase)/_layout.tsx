import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import SearchModel from '@/app/components/searchModel';
import SortModel from '@/app/components/sortModel';
import Allbill from './allbill';
import Unpaid from './unpaid';
import Paid from './paid';
import PurchaseModal from '../components/purchase/PurchaseModal';
import { Link } from 'expo-router';

const TopTab = createMaterialTopTabNavigator();

const Purchase = () => {
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortOption, setSortOption] = useState('Date'); // Default Sorting Option
    const [purchaseModal, setPurchaseModal] = useState(false)

    const handleSort = (option) => {
        setSortOption(option);
        setSortModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-white ">
            {/* Header */}
            <View className="flex flex-row justify-between items-center px-5 mb-3">
                <Link href="/more"><Ionicons name='chevron-back' size={24} color="#000" /></Link>
                <Text className="text-2xl font-medium">Purchase Orders</Text>
                <View className="flex flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                        <MaterialCommunityIcons name="sort" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
                        <FontAwesome name="search" size={24} color="#000" />
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
                <TopTab.Screen name="Allbill">
                    {() => <Allbill sortOption={sortOption} />}
                </TopTab.Screen>
                <TopTab.Screen name="Unpaid">
                    {() => <Unpaid sortOption={sortOption} />}
                </TopTab.Screen>
                <TopTab.Screen name="Paid">
                    {() => <Paid sortOption={sortOption} />}
                </TopTab.Screen>
            </TopTab.Navigator>

            <TouchableOpacity
                onPress={() => { setPurchaseModal(true) }}
                className="absolute bottom-20 right-4 bg-blue-500 rounded-full p-3"
            >
                <MaterialCommunityIcons name="plus" size={24} color="white" />
            </TouchableOpacity>



            {/* Modals */}
            {searchModalVisible && (
                <SearchModel visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} searchType="customer" />
            )}
            {sortModalVisible && (
                <SortModel onSort={handleSort} visible={sortModalVisible} onClose={() => setSortModalVisible(false)} />
            )}
            <PurchaseModal visible={purchaseModal} onClose={() => { setPurchaseModal(false) }} />
        </SafeAreaView>
    );
};

export default Purchase;
