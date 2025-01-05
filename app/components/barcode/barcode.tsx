import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import BarcodeModal from './barcodeModel'


const barcode = () => {
    const router = useRouter();
    const [item, setItems] = useState([])
    const fetchItems = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item`);
            if (!res.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await res.json();
            console.log(data.filterData, 'fetched data');
            setItems(data.filterData); // Assuming the API returns an array of items
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);
    return (
        <SafeAreaView>
            <View className='flex flex-row justify-between px-3'>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>generate barcode</Text>
            </View>
            <View>
                <BarcodeModal />
            </View>
        </SafeAreaView>
    )
}

export default barcode