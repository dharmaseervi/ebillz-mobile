import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import UpdateItems from '@/app/components/items/edititems';
import { Text, TouchableOpacity, View } from 'react-native';

const EditItems = ({ }) => {
  const { id } = useLocalSearchParams();
  
  const router = useRouter()
  return (
    <View className='flex-1 bg-white'>
      <View className='flex flex-row justify-between px-4 '>
        <TouchableOpacity onPress={() => { router.back() }} className=''>
          <Text className='text-indigo-700 text-lg'>back </Text>
        </TouchableOpacity>
        <Text className='text-lg'>Edit item</Text>
      </View>
      <UpdateItems itemId={id} />
    </View>
  )
}

export default EditItems
