import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

interface Customer {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
}

const Active = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { user } = useUser();
    const router = useRouter()

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/customer`);
            console.log(res.status, res.statusText);
            const data = await res.json();
            console.log(data);

            if (data) {
                setCustomers(data.customers);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Fetching error: ' + error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <SafeAreaView className='bg-white p-2 flex-1'>
            <View className='space-y-4'>
                {customers.map((customer) => (
                    <TouchableOpacity
                        key={customer?._id}
                        className='flex-row justify-between items-center p-2 border-b border-gray-300 hover:bg-gray-50 transition-colors mx-2'
                        onPress={()=>{router.push(`/customer/${customer._id}`)} }
                    >
                        <View className='flex-1'>
                            <Text className='text-lg font-semibold text-gray-800'>{customer.fullName}</Text>
                            <Text className='text-sm text-gray-600'>{customer.email}</Text>
                            <Text className='text-xs text-gray-500'>{customer.city}</Text>
                        </View>
                        <View className='bg-green-100 px-3 py-1 rounded-full'>
                            <Text className='text-xs font-semibold text-green-700'>Active</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default Active;
