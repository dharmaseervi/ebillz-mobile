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
    dueAmount: number; // Assuming due amount is a number
    lastActivity: string; // Assuming last activity is a date string
}

const Active = ({ sortOption }: { sortOption: string }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const router = useRouter();

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/customer`);
            const data = await res.json();
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
    }, [])


    const sortCustomers = (customers: Customer[], option: string) => {
        switch (option) {
            case 'name_asc':
                return customers.sort((a, b) => a.fullName.localeCompare(b.fullName));
            case 'name_desc':
                return customers.sort((a, b) => b.fullName.localeCompare(a.fullName));
            case 'due_amount_asc':
                return customers.sort((a, b) => a.dueAmount - b.dueAmount);
            case 'due_amount_desc':
                return customers.sort((a, b) => b.dueAmount - a.dueAmount);
            case 'last_activity_asc':
                return customers.sort(
                    (a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
                );
            case 'last_activity_desc':
                return customers.sort(
                    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
                );
            default:
                return customers;
        }
    };


    useEffect(() => {
        if (sortOption) {
            setCustomers((prevCustomers) => sortCustomers([...prevCustomers], sortOption));
        }
    }, [sortOption]);

    return (
        <SafeAreaView className='bg-white p-2 flex-1'>
            <View className='space-y-4'>
                {customers.map((customer) => (
                    <TouchableOpacity
                        key={customer?._id}
                        className='flex-row justify-between items-center p-2 border-b border-gray-300 hover:bg-gray-50 transition-colors mx-2'
                        onPress={() => router.push(`/customer/${customer._id}`)}
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
