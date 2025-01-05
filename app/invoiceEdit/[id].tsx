import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { ModalProvider } from '@/app/components/invoice/contextModel';
import ItemModal from '@/app/components/invoice/itemModel';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ItemDetailsModel from '@/app/components/invoice/itemDetailsModel';
import DiscountTaxModal from '@/app/components/invoice/DiscountTaxModal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import EditCustomerModal from '../components/invoiceEdit/customerEditModel';
import EditItemModal from '../components/invoiceEdit/editItemModel';
import BarcodeModel from '../(scanner)/barcode-reader';

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

const UpdateInvoice = () => {
    const { id } = useLocalSearchParams();
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
    const handleRemoveItem = (index: number) => {
        setSelectedItems(prevItems => {
            const updatedItems = prevItems.filter((_, i) => i !== index);
            return updatedItems;
        });
    };
    const [invoice, setInvoice] = useState([])
    const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);

    const fetchInvoice = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice?id=${id}`);
            const data = await res.json();
            setInvoice(data);
            setSelectedItems(data.items)
            setInvoiceDate(data.invoiceDate)
            setDueDate(data.dueDate)
            setInvoiceNumber(data.invoiceNumber)
            setOrderNumber(data.orderNumber)
            setSalesperson(data.salesperson)
            setCustomerId(data.customerId._id)
        } catch (error) {
            console.error('Fetching error:', error);
        }
    }

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
        const itemIds = selectedItems.map(item => item._id).join(',');
        if (!itemIds) return; // Exit if no items selected
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item?id=${itemIds}`);
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
    useEffect(() => {
        fetchInvoice()
    }, [id])

    const closeModal = () => {
        setModalVisible(false);
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

    const handleItemUpdate = (updatedItem: Item) => {
        setSelectedItems(prevItems =>
            prevItems.map(item =>
                item._id === updatedItem._id ? { ...item, ...updatedItem } : item
            )
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
            _id: invoice._id,
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
        console.log(invoiceData, 'updated invoice data');


        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceData),
            });

            const result = await res.json();
            if (res.status == 200) {
                router.back()
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };


    return (
        <ModalProvider>
            <SafeAreaView className='flex-1 bg-slate-100'>
                <View className="flex-1  bg-slate-100">
                    <View className="flex-row justify-between items-center px-4">
                        <TouchableOpacity onPress={() => router.back()} >
                            <Text>Back</Text>
                        </TouchableOpacity>
                        <View>
                            <Text className="text-xl text-black font-bold">Update Invoice</Text>
                        </View>
                    </View>
                    <ScrollView className='mt-4 px-4' contentContainerStyle={{ paddingBottom: 20 }}>

                        <Text className='uppercase text-black mb-1'>Customer Details</Text>
                        {customerId?.length === 0 ? (
                            // Display "Select Customer" button if no customer is selected
                            <View className='mb-4'>
                                <TouchableOpacity
                                    className='bg-white px-4 py-2 rounded'
                                    onPress={() => setCustomerModalVisible(true)}
                                >
                                    <View className='flex flex-row justify-between'>
                                        <Text>Select Customer</Text>
                                        <FontAwesome name={'angle-right'} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // Show selected customer details if a customer is selected
                            <View className='bg-white p-3 rounded-lg mb-4'>
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
                            <View className='bg-white rounded-lg '>
                                <TouchableOpacity
                                    className=' bg-white rounded-lg px-2'
                                    onPress={() => setItemModalVisible(true)}
                                >
                                    <View className='flex flex-row  justify-between  items-center p-2 '>
                                        <Text>Add Items</Text>
                                        <View className='flex flex-row '>
                                            <TouchableOpacity onPress={() => { setBarcodeModalVisible(true) }} className='' >
                                                <Ionicons
                                                    name='scan'
                                                    size={30}
                                                    color="blue"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {selectedItems.length > 0 && selectedItems.map((item, index) => (
                                    <View key={index} className='p-3'>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedItemId(item); // Set the selected item ID
                                                setItemDetailsModal(true);  // Open the modal
                                            }}
                                            className='flex flex-row justify-between py-1 border-b px-1 border-gray-200'>
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

                        <View className='bg-white p-4 rounded-lg '>
                            <Text className='uppercase text-black mb-2'>Invoice Details</Text>
                            <View className='mb-2 flex flex-row  items-center justify-between border-b border-gray-200'>
                                <Text className='text-black'>Invoice Date</Text>
                                <View className='flex flex-row justify-center items-center '>
                                    <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)} className=' p-2 rounded'>
                                        <Text>{new Date(invoiceDate).toLocaleDateString()}</Text>
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
                                        <Text>{new Date(dueDate).toLocaleDateString()}</Text>
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
                        <TouchableOpacity onPress={() => createInvoice()} className='border px-2 py-3 mt-2 rounded-lg flex justify-center items-center'>
                            <Text>create invoice</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Customer and Item Modals */}
                    <EditCustomerModal selectedCustomerId={invoice?.customerId?._id} setCustomerModalVisible={setCustomerModalVisible} initialSelectedCustomerId={customerId} setCustomerId={setCustomerId} visible={customerModalVisible} onClose={closeCustomerModal} />
                    <EditItemModal visible={itemModalVisible} onClose={closeItemModal} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
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
            </SafeAreaView >
        </ModalProvider >
    );
};

export default UpdateInvoice;
