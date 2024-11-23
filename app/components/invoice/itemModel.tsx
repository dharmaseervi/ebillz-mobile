import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ItemModal = ({ visible,  onClose, setSelectedItems, selectedItems,  }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);

  // Fetch items based on the search query
  const fetchItems = async (query) => {
    try {
      const response = await fetch(`http://localhost:3000/api/item?search=${query}`);
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
     // If the item is not already selected, add it to the list
     setSelectedItems(prev => {
      const existingItemIndex = prev.findIndex(selectedItem => selectedItem._id === item._id);
  
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1, // Increase quantity
        };
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity set to 1
        return [...prev, { ...item, quantity: 1 }];
      }
    }); 
    setTimeout(() => {
      onClose(false)
    }, 300)
  };


  const renderItem = ({ item }) => (

    <TouchableOpacity
      className="bg-gray-200 m-2 p-2  rounded-lg flex flex-row justify-between "
      onPress={() => {
        handleItemSelect(item);
      }}
    >
      <View className=''>
        <Text>{item.name}</Text>
        <Text>Qty:{item.quantity}</Text>
      </View>
      <Text>₹{item.sellingPrice}</Text>
      {
        selectedItems ? (
          <FontAwesome name="check-circle" size={24} color="green" />
        ) : (
          <FontAwesome name="circle-thin" size={24} color="gray" />
        )
      }
    </TouchableOpacity >
  );

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 pt-16 bg-white bg-opacity-50">
        <View className="flex flex-row justify-between items-center w-full px-4">
          <TouchableOpacity onPress={onClose}>
            <Text className='text-blue-600 text-lg'>Close</Text>
          </TouchableOpacity>
          <Text className="text-xl text-white font-bold">Add Items</Text>
          <TouchableOpacity
            onPress={() => {
              handleItemSelect(selectedItems); // Send selected item IDs back to parent
              onClose();
            }}
          >
            <Text className='text-blue-600 text-lg'>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View className="bg-white rounded-lg m-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
            className="p-2 border rounded-lg"
          />
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-">No items found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Modal>
  );
};

export default ItemModal;
