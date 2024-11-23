import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const EditItemModal = ({
  visible,
  onClose,
  setSelectedItems,
  selectedItems,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);

  // Fetch items based on the search query
  const fetchItems = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/item?search=${query}`
      );
      const data = await response.json();
      setItems(data.filterData);
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

  const handleItemSelect = (item) => {
    setSelectedItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (selectedItem) => selectedItem._id === item._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if the item exists
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }

      // Add new item with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );

    return (
      <TouchableOpacity
        className={`bg-gray-200 m-2 p-2 rounded-lg flex flex-row justify-between ${
          isSelected ? 'border border-blue-500' : ''
        }`}
        onPress={() => {
          if (isSelected) {
            handleRemoveItem(item._id);
          } else {
            handleItemSelect(item);
          }
        }}
      >
        <View>
          <Text>{item.name}</Text>
          <Text>Qty: {isSelected ? selectedItems.find(si => si._id === item._id)?.quantity : 0}</Text>
        </View>
        <Text>₹{item.sellingPrice}</Text>
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
      onRequestClose={() => onClose(false)}
    >
      <View className="flex-1 bg-white pt-10">
        <View className="flex flex-row justify-between items-center p-4">
          <TouchableOpacity onPress={() => onClose(false)}>
            <Text className="text-blue-600 text-lg">Close</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold">Select Items</Text>
          <TouchableOpacity onPress={() => onClose(false)}>
            <Text className="text-blue-600 text-lg">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View className="bg-white rounded-lg m-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search items..."
            className="p-2 border rounded-lg"
          />
        </View>

        {/* Item List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-5">No items found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Modal>
  );
};

export default EditItemModal;
