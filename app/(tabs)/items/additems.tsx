import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    RefreshControl,
    TextInput,
} from 'react-native';
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AddItemModal from '@/app/components/items/additemmodel';
import { useRouter } from 'expo-router';
import BarcodeModal from '@/app/components/barcode/barcodeModel';

const ItemsPage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
    const [selectedBarcode, setSelectedBarcode] = useState('');
    const router = useRouter();

    const fetchItems = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item`);
            if (!res.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await res.json();
            setItems(data.filterData); // Assuming the API returns an array of items
            setFilteredItems(data.filterData); // Initialize filteredItems
        } catch (error) {
            console.error('Error fetching items:', error);
            Alert.alert('Error', 'Failed to fetch items. Please try again later.');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchItems();
        setRefreshing(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredItems(items);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            setFilteredItems(
                items.filter((item) =>
                    item.name.toLowerCase().includes(lowerCaseQuery)
                )
            );
        }
    };

    const renderItem = ({ item }) => (
        <View className="p-2 border-b bg-white border-gray-200 rounded-md my-1">
            <TouchableOpacity
                onPress={() => {
                    router.push(`/items/${item._id}`);
                }}
                className="flex-1 flex-row justify-between"
            >
                <View>
                    <Text className="text-gray-800 font-medium text-lg">{item.name}</Text>
                    <Text className="text-gray-500">Quantity: {item.quantity}</Text>
                </View>
                <View>
                    <Text className="text-gray-500">Price: ₹{item.sellingPrice}</Text>
                </View>
            </TouchableOpacity>
            <View className="mt-1">
                <TouchableOpacity
                    onPress={() => {
                        setSelectedBarcode(item.barcode); // Pass the product's barcode
                        setBarcodeModalVisible(true); // Show the barcode modal
                    }}
                    className="flex-row items-center"
                >
                    <Text className="text-indigo-600">View barcode</Text>
                    <EvilIcons name={'chevron-right'} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <Text className="text-2xl font-bold text-gray-800 mx-4 mt-4">Stock Management</Text>
            <View className="m-4">
                <TextInput
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Search items by name"
                    className="p-2 border border-gray-300 rounded-md bg-gray-100"
                />
            </View>
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                className="m-2 bg-white rounded-xl shadow-md"
                ListEmptyComponent={<Text className="text-center text-gray-500 mt-2">No items available.</Text>}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="absolute bottom-0 right-4 bg-blue-800 rounded-full p-4"
            >
                <MaterialCommunityIcons name="plus" size={24} color="white" />
            </TouchableOpacity>
            <AddItemModal visible={modalVisible} onClose={() => setModalVisible(false)} />
            <BarcodeModal
                visible={barcodeModalVisible}
                onClose={() => setBarcodeModalVisible(false)}
                barcodeValue={selectedBarcode}
            />
        </View>
    );
};

export default ItemsPage;
