import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
}

const CustomerModal = ({ setCustomerModalVisible, visible, onClose, setCustomerId }: any) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State to hold search input

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
  }, []);



  const hanleSelecetCustomer = (id: string) => {
    setCustomerId(id)
    console.log(customers ,'selected');
    
    setTimeout(() => {
      setCustomerModalVisible(false)
    }, 200)
  }


  // Filter customers based on the search term
  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Handle back button on Android
    >
      <View className="flex-1 pt-16 bg-gray-100   ">
        <View className="flex flex-row justify-between items-center w-full px-4 py-2">
          <TouchableOpacity onPress={onClose}>
            <Text className='text-blue-600 text'>Close</Text>
          </TouchableOpacity>
          <Text className="text-lg text-black ">Select Customer</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className='text-blue-600'>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View className='px-4 py-2'>
          <TextInput
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className='bg-gray-200 p-2 rounded'
          />
        </View>

        <ScrollView className='my-4 px-4 flex-1' contentContainerStyle={{ paddingBottom: 20 }}>
          <View className='bg-gray-200  rounded-lg p-4'>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <TouchableOpacity
                  className=''
                  key={customer._id}
                  onPress={() => hanleSelecetCustomer(customer._id)}
                >
                  <View className='border-b border-gray-300  mb-2'>
                    <Text className='text-lg text-black'>{customer.fullName}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className='text-center text-gray-600'>No customers found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CustomerModal;
