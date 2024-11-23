import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'



interface CompanyDetails {
    companyName: string
    address: string
    city: string
    state: string
    zip: string
    contactNumber: string
    gstNumber: string
}

const EditCompany = () => {
    const { companyId } = useLocalSearchParams<{ companyId: string }>()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
        companyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactNumber: '',
        gstNumber: '',
    })

    useEffect(() => {
        fetchCompanyDetails()
    }, [companyId])
    console.log(companyId);

    const fetchCompanyDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/company?id=${companyId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch company details')
            }
            const data = await response.json()
            setCompanyDetails(data.Company)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching company details:', error)
            setLoading(false)
        }
    }

    const handleInputChange = (field: keyof CompanyDetails, value: string) => {
        setCompanyDetails(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
       

        setSaving(true)
        try {
            const response = await fetch(`http://localhost:3000/api/company?id=${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companyDetails),
            })

            if (!response.ok) {
                throw new Error('Failed to update company')
            }

            Alert.alert('Success', 'Company updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ])
        } catch (error) {
            console.error('Error updating company:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900">
            <View className="p-6">
                <Text className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Edit Company</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</Text>
                        < TextInput
                            value={companyDetails?.companyName}
                            onChangeText={(value) => handleInputChange('companyName', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter company name"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</Text>
                        <TextInput
                            value={companyDetails?.address}
                            onChangeText={(value) => handleInputChange('address', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter company address"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</Text>
                        <TextInput
                            value={companyDetails.city}
                            onChangeText={(value) => handleInputChange('city', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter city"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</Text>
                        <TextInput
                            value={companyDetails.state}
                            onChangeText={(value) => handleInputChange('state', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter state"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</Text>
                        <TextInput
                            value={companyDetails.zip}
                            onChangeText={(value) => handleInputChange('zip', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter ZIP code"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</Text>
                        <TextInput
                            value={companyDetails.contactNumber}
                            onChangeText={(value) => handleInputChange('contactNumber', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter mobile number"
                            placeholderTextColor="#9ca3af"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</Text>
                        <TextInput
                            value={companyDetails.gstNumber}
                            onChangeText={(value) => handleInputChange('gstNumber', value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                            placeholder="Enter GST number"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={saving}
                    className={`mt-8 py-3 px-6 rounded-lg ${saving ? 'bg-gray-400' : 'bg-blue-500'}`}
                >
                    <Text className="text-white font-semibold text-center text-lg">
                        {saving ? 'Updating...' : 'Update Company'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default EditCompany