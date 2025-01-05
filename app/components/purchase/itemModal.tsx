import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AddItemModal from '../items/additemmodel';

const PurchaseItemModal = ({ visible, onClose, onAddItems, onAddNewItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch items based on the search query
  const fetchItems = async (query) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item?search=${query}`);
      const data = await response.json();
      setItems(data.filterData || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchItems(searchQuery);
    } else {
      setItems([]); // Clear items when no search query
    }
  }, [searchQuery]);

  // Handle selecting an item
  const handleItemSelect = (item) => {
    setSelectedItems((prev) => {
      const existingItemIndex = prev.findIndex((selectedItem) => selectedItem._id === item._id);

      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item with quantity set to 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Handle confirming selected items
  const handleAddItems = () => {
    onAddItems(selectedItems);
    onClose();
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem._id === item._id);
    return (
      <TouchableOpacity
        className="bg-gray-200 m-2 p-2 rounded-lg flex flex-row justify-between items-center"
        onPress={() => handleItemSelect(item)}
      >
        <View>
          <Text className="text-lg">{item.name}</Text>
          <Text className="text-sm text-gray-500">₹{item.sellingPrice}</Text>
        </View>
        {isSelected ? (
          <FontAwesome name="check-circle" size={24} color="green" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="gray" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white pt-14">
        <View className="flex flex-row justify-between items-center p-4">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-indigo-600 text-lg">Close</Text>
          </TouchableOpacity>
          <Text className="text-black text-xl font-bold">Add Items</Text>
          <TouchableOpacity onPress={handleAddItems}>
            <Text className="text-indigo-600 text-lg">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="p-2 flex-row justify-between gap-2">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            className="bg-white p-2 flex-1 rounded-lg border"
          />
          <TouchableOpacity
            className=" bg-indigo-600 p-3 rounded-lg "
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white">+</Text>
          </TouchableOpacity>
        </View>

        {/* Items List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="mt-4 items-center">
              <Text className="text-center text-gray-500">No items found.</Text>

            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Modal>
  );
};

export default PurchaseItemModal;
