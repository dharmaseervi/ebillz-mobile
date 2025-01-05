import React, { useState } from 'react'
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'

const SortOption = ({ title, isSelected, onSelect }) => (
  <TouchableOpacity 
    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${isSelected ? 'bg-blue-50' : ''}`}
    onPress={onSelect}
  >
    <Text className={`text-lg ${isSelected ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>{title}</Text>
    {isSelected && <Feather name="check" size={20} color="#2563EB" />}
  </TouchableOpacity>
)

const SortModel = ({ visible, onClose, onSort }) => {
  const [selectedSort, setSelectedSort] = useState('name_asc')

  const sortOptions = [
    { id: 'name_asc', title: 'Name (A to Z)' },
    { id: 'name_desc', title: 'Name (Z to A)' },
    { id: 'due_amount_asc', title: 'Due Amount (Low to High)' },
    { id: 'due_amount_desc', title: 'Due Amount (High to Low)' },
    { id: 'last_activity_asc', title: 'Last Activity (Oldest First)' },
    { id: 'last_activity_desc', title: 'Last Activity (Newest First)' },
  ]

  const handleSort = (sortId) => {
    setSelectedSort(sortId)
    onSort(sortId)
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50  justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-semibold text-gray-800">Sort Customers</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView className="max-h-96">
            {sortOptions.map((option) => (
              <SortOption
                key={option.id}
                title={option.title}
                isSelected={selectedSort === option.id}
                onSelect={() => handleSort(option.id)}
              />
            ))}
          </ScrollView>
          <View className="p-4 mb-5">
            <TouchableOpacity 
              className="bg-blue-600 py-3 px-4 rounded-lg"
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold text-lg">Apply Sort</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default SortModel