import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import Paid from './paid';
import Unpaid from './unpaid';
import Allbill from './allbill';
import { ModalProvider } from '@/app/components/invoice/contextModel';
import CustomerModal from '@/app/components/invoice/customerModel';
import ItemModal from '@/app/components/invoice/itemModel';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ItemDetailsModel from '@/app/components/invoice/itemDetailsModel';
import DiscountTaxModal from '@/app/components/invoice/DiscountTaxModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BarcodeModel from '@/app/(scanner)/barcode-reader';
import SortModel from '@/app/components/sortModel';
import SearchModel from '@/app/components/searchModel';

const TopTab = createMaterialTopTabNavigator();

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
}
interface Item {
  quantity: any;
  _id: string;
  name: string;
  hsnCode: number;
  sellingPrice: number;
  description: string;
  unit: string;
}

const TopTabNavigator = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [itemDetailsModal, setItemDetailsModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [customerId, setCustomerId] = useState([])
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountTaxValues, setDiscountTaxValues] = useState({
    discount: 0,
    taxRate: 18,
  });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const subtotal = selectedItems.reduce((total, item) => total + item?.sellingPrice * item?.quantity, 0);
  const taxRate = discountTaxValues.taxRate / 2;
  const cgst = subtotal * (taxRate / 100);
  const sgst = subtotal * (taxRate / 100);
  const tax = cgst + sgst;
  const discount = subtotal * (discountTaxValues.discount / 100);
  const total = subtotal - discount + tax;
  const [items, setItems] = useState([])
  const router = useRouter()
  const [sortOption, setSortOption] = useState(''); // Sorting Preferences
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false); // For Search Modal
  const searchParams = useLocalSearchParams();
  // Handle Sorting Preferences
  const handleSort = (option) => {
    setSortOption(option); // Set the selected sort option
    setSortModalVisible(false); // Close Sort Modal
  };

  
  useEffect(() => {
    // Check the query parameter to determine if the modal should be open
    if (searchParams?.modalVisible === 'true') {
      setModalVisible(true);
    }
  }, [searchParams]);

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prevItems => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      return updatedItems;
    });
  };
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);

  const handleCreateInvoice = () => {
    setModalVisible(true);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/customer?id=${customerId}`);
      const data = await res.json();
      if (data?.customer) {
        setCustomers(data.customer);
      }
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };
  const fetchItems = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item?id=${selectedItems}`);
      const data = await response.json();
      const itemsArray = Array.isArray(data.filterData) ? data.filterData : [];
      setItems(itemsArray);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };


  useEffect(() => {
    fetchItems()
  }, [selectedItems])

  useEffect(() => {
    fetchCustomers();
  }, [customerId]);

  const closeModal = () => {
    setModalVisible(false);
    router.replace('/invoice'); // Remove the query parameter
  };

  const closeCustomerModal = () => {
    setCustomerModalVisible(false);
  };

  const closeItemModal = () => {
    setItemModalVisible(false);
  };
  const closeItemDetailModal = () => {
    setItemDetailsModal(false)
  }

  const handleInvoiceDateChange = (selectedDate: any) => {
    const currentDate = selectedDate || invoiceDate;
    setShowInvoiceDatePicker(false);
    setInvoiceDate(currentDate);
    console.log(currentDate, invoiceDate);

  };

  const handleDueDateChange = (selectedDate: any) => {
    const currentDate = selectedDate || dueDate;
    setShowDueDatePicker(false);
    setDueDate(currentDate);
  };

  const handleItemUpdate = (updatedItem: { id: any; }) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
  };

  const handleSave = (newValues) => {
    setDiscountTaxValues(newValues);
  };



  const createInvoice = async () => {
    // Validate required fields before proceeding
    if (!customerId || selectedItems.length === 0 || total <= 0) {
      console.error('Missing required fields or invalid total amount');
      return;
    }
    const invoiceData = {
      invoiceDate,
      dueDate,
      salesperson,
      orderNumber,
      customerId,
      items: selectedItems.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
      })),
      subtotal,
      discount,
      cgst,
      sgst,
      tax,
      total,
    };

    try {
      const res = await fetch('http://localhost:3000/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const result = await res.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
    // Clear the fields by resetting the state variables
    setInvoiceDate(new Date());
    setDueDate(new Date());
    setSalesperson('');
    setOrderNumber('');
    setCustomerId([]);
    setSelectedItems([]);
  };


  return (
    <ModalProvider >
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-row justify-between items-center px-5 mb-3'>
          <Text className='text-2xl font-medium'>Invoice</Text>
          <View className='flex-row items-center gap-2'>
            <TouchableOpacity onPress={() => setSortModalVisible(true)}>
              <MaterialCommunityIcons name="sort" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TopTab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: '#03c6fc' },
            tabBarStyle: { backgroundColor: '' },
          }}
        >
          <TopTab.Screen name="Paid" >
            {() => <Paid sortOption={sortOption} />}
          </TopTab.Screen>
          <TopTab.Screen name="Unpaid" >
            {() => <Unpaid sortOption={sortOption} />}
          </TopTab.Screen>
          <TopTab.Screen name="AllBill">
            {() => <Allbill sortOption={sortOption} />}
          </TopTab.Screen>
        </TopTab.Navigator>

        <TouchableOpacity
          onPress={handleCreateInvoice}
          className="absolute bottom-6 right-4 bg-blue-600 rounded-full p-3"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>

        {/* Modal for Creating Invoice */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 pt-16 bg-white">
            <View className="flex-row justify-between items-center px-4">
              <TouchableOpacity onPress={closeModal}>
                <Text className='text-blue-600 text-lg'>Close</Text>
              </TouchableOpacity>
              <Text className="text-xl text-black font-bold">Create Invoice</Text>
              <TouchableOpacity onPress={() => createInvoice()} >
                <Text className='text-blue-600 text-lg'>Save</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className='mt-4 px-4' contentContainerStyle={{ paddingBottom: 20 }}>

              <Text className='uppercase text-black mb-1'>Customer Details</Text>
              {customerId.length === 0 ? (
                // Display "Select Customer" button if no customer is selected
                <View className='mb-4'>
                  <TouchableOpacity
                    className='bg-gray-200 px-4 py-2 rounded-lg'
                    onPress={() => setCustomerModalVisible(true)}
                  >
                    <View className='flex flex-row justify-between p-1'>
                      <Text>Select Customer</Text>
                      <FontAwesome name={'angle-right'} size={20} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                // Show selected customer details if a customer is selected
                <View className='bg-gray-200 p-3 rounded-lg mb-4'>
                  {customers && (
                    <View>
                      <TouchableOpacity onPress={() => setCustomerModalVisible(true)} className='text-sm font-semibold text-gray-800'>
                        <Text>{customers?.fullName}</Text>
                      </TouchableOpacity>
                      <Text className='text-sm text-gray-600'>{customers?.email}</Text>
                      <Text className='text-sm text-gray-600'>{customers?.phone}</Text>
                      <View className='border-b border-gray-200 py-2'>
                        <Text>Shipping To:</Text>
                        <Text className='text-sm text-gray-600'>{customers?.city}</Text>
                      </View>
                      <View className='border-b border-gray-200 py-2'>
                        <Text>Billing To:</Text>
                        <Text className='text-sm text-gray-600'>{customers?.city}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}


              {/* Items Section */}
              <View className='mb-4 '>
                <Text className='uppercase text-black mb-1'>Items Details</Text>
                <View className='bg-gray-200 rounded-lg '>
                  <TouchableOpacity
                    className=' bg-gray-200 rounded-lg px-2'
                    onPress={() => setItemModalVisible(true)}
                  >
                    <View className='flex flex-row  justify-between  items-center p-2 '>
                      <Text>Add Items</Text>
                      <View className='flex flex-row '>
                        <TouchableOpacity onPress={() => { setBarcodeModalVisible(true) }} className='' >
                          <Ionicons
                            name='scan'
                            size={20}
                            color="blue"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {selectedItems.length > 0 && selectedItems.map((item, index) => (
                    <View key={index} className='p-3  '>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItemId(item); // Set the selected item ID
                          setItemDetailsModal(true);  // Open the modal
                        }}
                        className='flex flex-row justify-between py-1 border-b px-1 border-gray-400'>
                        <View>
                          <Text className='font-semibold'>{item.name}</Text>
                          <Text>Qty: {item.quantity}</Text>
                        </View>
                        <View className='flex flex-row gap-2'>
                          <Text>₹{item.sellingPrice}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveItem(index)}
                            className='bg-red-500 rounded p-2'
                          >
                            <MaterialCommunityIcons name="delete" size={15} color="white" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </View>

                  ))}

                  {selectedItems.length > 0 && (
                    <View>
                      <TouchableOpacity onPress={() => setIsModalOpen(true)} className='p-3 flex items-end border-b border-gray-200'>
                        <View className='flex flex-row gap-2 '>
                          <Text>Sub Total</Text>
                          <Text>{subtotal}</Text>
                        </View>
                        <View className='flex flex-row gap-2 '>
                          <Text>discount</Text>
                          <Text>{discount}</Text>
                        </View>
                        <View className='flex flex-row gap-2 '>
                          <Text>CGST</Text>
                          <Text>{cgst.toFixed(2)}</Text>
                        </View>
                        <View className='flex flex-row gap-2 '>
                          <Text>SGST</Text>
                          <Text>{sgst.toFixed(2)}</Text>
                        </View>
                        <View className='flex flex-row gap-2 '>
                          <Text>Total Tax</Text>
                          <Text>{tax.toFixed(2)}</Text>
                        </View>
                      </TouchableOpacity>
                      <View className='p-3 flex items-end'><Text>Total:{total.toFixed(2)}</Text></View>
                    </View>
                  )}
                </View>
              </View>

              <Text className='uppercase text-black mb-2'>Invoice Details</Text>
              <View className='bg-gray-200 p-4 rounded-lg  '>
                <View className='mb-2 flex flex-row  items-center justify-between border-b border-gray-200'>
                  <Text className='text-black'>Invoice Date</Text>
                  <View className='flex flex-row justify-center items-center '>
                    <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)} className=' p-2 rounded'>
                      <Text>{invoiceDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <FontAwesome name={'angle-right'} size={20} />
                  </View>
                  <DateTimePickerModal
                    isVisible={showInvoiceDatePicker}
                    mode="date"
                    onConfirm={handleInvoiceDateChange} // Pass selected date to the handler
                    onCancel={() => setShowInvoiceDatePicker(false)}
                  />
                </View>

                <View className='mb-2 flex flex-row border-b border-gray-200 items-center justify-between'>
                  <Text className='text-black'>Invoice#</Text>
                  <TextInput
                    value={invoiceNumber}
                    onChangeText={setInvoiceNumber}
                    placeholder="Enter invoice number"
                    className='p-2 rounded'
                  />
                </View>


                <View className='mb-2 flex flex-row border-b border-gray-200  items-center justify-between'>
                  <Text className='text-black'>Due Date</Text>
                  <View className='flex flex-row justify-center items-center '>
                    <TouchableOpacity onPress={() => setShowDueDatePicker(true)} className=' p-2 rounded'>
                      <Text>{dueDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <FontAwesome name={'angle-right'} size={20} />
                  </View>
                  <DateTimePickerModal
                    isVisible={showDueDatePicker}
                    mode="date"
                    onConfirm={handleDueDateChange} // Pass selected date to the handler
                    onCancel={() => setShowDueDatePicker(false)}
                  />
                </View>

                <View className='mb-2 flex flex-row  border-b border-gray-200 items-center justify-between'>
                  <Text className='text-black'>Order#</Text>
                  <TextInput
                    value={orderNumber}
                    onChangeText={setOrderNumber}
                    placeholder="Enter order number"
                    className=' p-2 rounded'
                  />
                </View>

                <View className='mb-2 flex flex-row border-b border-gray-200  items-center justify-between'>
                  <Text className='text-black'>Salesperson</Text>
                  <TextInput
                    value={salesperson}
                    onChangeText={setSalesperson}
                    placeholder="Enter salesperson"
                    className=' p-2 rounded'
                  />

                </View>
              </View>

            </ScrollView>

            {/* Customer and Item Modals */}
            <CustomerModal setCustomerModalVisible={setCustomerModalVisible} setCustomerId={setCustomerId} visible={customerModalVisible} onClose={closeCustomerModal} />
            <ItemModal visible={itemModalVisible} onClose={closeItemModal} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
            <ItemDetailsModel onUpdate={handleItemUpdate} visible={itemDetailsModal} onClose={closeItemDetailModal} item={selectedItemId} />
            <DiscountTaxModal isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              currentValues={discountTaxValues} />

            <BarcodeModel visible={barcodeModalVisible}
              onClose={() => setBarcodeModalVisible(false)}
              onAddItem={setSelectedItems}
            />
          </View>
        </Modal>
        {/* Sort Modal */}
        <SortModel onSort={handleSort} visible={sortModalVisible} onClose={() => setSortModalVisible(false)} />
        <SearchModel visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} searchType={'invoice'} />
      </SafeAreaView >
    </ModalProvider >
  );
};

export default TopTabNavigator;
