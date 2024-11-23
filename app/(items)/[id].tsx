import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const EditItems = () => {
    const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>EditItems hello dharma {id}</Text>
    </View>
  )
}

export default EditItems