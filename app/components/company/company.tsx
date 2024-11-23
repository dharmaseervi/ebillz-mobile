import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'


interface Company {
  _id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  mobileNo: string
  gstNo: string
}

const CompanyProfile = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/company')
      const data = await response.json()
      console.log(data);
      
      setCompanies(data.companies)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching companies:', error)
      setLoading(false)
    }
  }

  const handleEdit = (company: Company) => {
    router.push({
      pathname: '/EditCompany',
      params: { companyId: company._id }
    })
  }

  const handleDelete = async (companyId: string) => {
    Alert.alert(
      'Delete Company',
      'Are you sure you want to delete this company?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/company/${companyId}`, {
                method: 'DELETE',
              })
              if (response.ok) {
                setCompanies(companies.filter(company => company._id !== companyId))
              } else {
                throw new Error('Failed to delete company')
              }
            } catch (error) {
              console.error('Error deleting company:', error)
              Alert.alert('Error', 'Failed to delete company. Please try again.')
            }
          }
        }
      ]
    )
  }

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <Text className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{item.name}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">{item.address}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">{`${item.city}, ${item.state} - ${item.zipCode}`}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">Mobile: {item.mobileNo}</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">GST: {item.gstNo}</Text>
      <View className="flex-row justify-end mt-4">
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
        >
          <Text className="text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex bg-gray-100 dark:bg-gray-900">
      <View className="p-4">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-lg mb-4 flex-row justify-center items-center"
          onPress={() => router.push('/CreateCompany')}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white font-bold ml-2">
            Create New Company
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : companies?.length > 0 ? (
          <FlatList
            data={companies}
            renderItem={renderCompanyItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              No companies found. Create a new one to get started.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default CompanyProfile