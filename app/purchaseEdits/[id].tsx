import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useUser } from '@clerk/clerk-expo';
import PurchaseItemDetailsEditModel from '../components/purchaseEdit/itemDetailsEditModal';
import SupplierEditModal from '../components/purchaseEdit/supplierEditModal';
import PurchaseItemEditModal from '../components/purchaseEdit/itemEditModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const PurchaseEdit = ({ }) => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [supplierModalVisible, setSupplierModalVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [purchaseItemModalVisible, setPurchaseItemModalVisible] = useState(false);
    const [invoiceDate, setInvoiceDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [purchaseItemDetailsModalVisible, setPurchaseItemDetailsModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const { user } = useUser();
    const [purchaseInvoice, setPurchaseInvoice] = useState([]);

    const handleItemUpdate = (updatedItem: { id: any; }) => {
        setSelectedItems((prevItems) =>
            prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
        );
    };


    const handleInvoiceDateChange = (date) => {
        setInvoiceDate(date);
        setShowInvoiceDatePicker(false);
    };

    const handleDueDateChange = (date) => {
        setDueDate(date);
        setShowDueDatePicker(false);
    };

    const fetchPurchaseInvoice = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice?id=${id}`);
            const data = await response.json();
            setPurchaseInvoice(data.data);
            setInvoiceDate(new Date(data.data[0]?.purchaseDate));
            setDueDate(new Date(data.data[0]?.dueDate));
            setInvoiceNumber(data.data[0]?.invoiceNumber?.toString() || '');
            setOrderNumber(data.data[0]?.purchaseOrderNumber?.toString() || '');
        } catch (error) {
            console.error('Error fetching purchase invoice:', error);
        }
    }
    useEffect(() => {
        fetchPurchaseInvoice();
    }, [id]);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const fetchItemById = async () => {
        const itemsId = purchaseInvoice[0]?.items.map((item) => {
            return item.productId._id;
        });

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/item?=${itemsId}`);
            const data = await response.json();
            console.log(data, 'datazzz');
            setSelectedItems(data.filterData);

        } catch (error) {
            console.error('Error fetching item:', error);
        }
    }

    useEffect(() => {
        fetchItemById()
    }, []);

    const calculateTotal = () => {
        const subtotal = selectedItems?.reduce((sum, item) => sum + (item?.sellingPrice || 0) * (item?.quantity || 0), 0);
        const cgst = subtotal * 0.09; // 9% CGST
        const sgst = subtotal * 0.09; // 9% SGST
        return {
            subtotal: formatCurrency(subtotal),
            cgst: formatCurrency(cgst),
            sgst: formatCurrency(sgst),
            total: formatCurrency(subtotal + cgst + sgst),
            totalAmount: subtotal + cgst + sgst,
        };
    };

    const { subtotal, cgst, sgst, total, totalAmount } = calculateTotal();

    // In your PurchaseModal's Save button handler
    const handleSave = async () => {
        const invoiceData = {
            id: purchaseInvoice[0]?._id,
            invoiceNumber,
            purchaseOrderNumber: orderNumber,
            supplierName: selectedSupplier?.name,
            supplierId: selectedSupplier?._id,
            purchaseDate: invoiceDate,
            dueDate,
            items: selectedItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
                unitPrice: item.sellingPrice,
                totalPrice: item.quantity * item.sellingPrice,
            })),
            invoiceStatus: 'not paid', // Default status
            totalAmount: totalAmount, // From calculateTotal()
            userId: user?.id, // Replace with actual user ID
        };

        console.log('Updated Invoice Number:', invoiceData);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceData),
            });

            console.log(response, 'red');


            if (!response.ok) {
                throw new Error('Failed to save invoice');
            }

            const data = await response.json();
            console.log(data, 'data');

            alert('Success');
            return data;
        } catch (error) {
            alert('Error');
        }
    };
  


    return (
        <SafeAreaView className="flex-1">
            <View className=" bg-white">
                {/* Header */}
                <View className="flex-row justify-between items-center px-4 mb-5">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text className="text-blue-600 text-lg">Back</Text>
                    </TouchableOpacity>
                    <Text className="text-xl text-black font-bold">Create Purchase Invoice</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text className="text-blue-600 text-lg">Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <ScrollView className="px-4">
                    {/* Add Supplier */}
                    <View className="bg-gray-100 p-2 rounded-xl">
                        <TouchableOpacity
                            className="flex-row justify-between items-center"
                            onPress={() => setSupplierModalVisible(true)}
                        >
                            <Text className="text-black text-lg">Add Supplier</Text>
                            <EvilIcons name="chevron-right" size={24} color="black" />
                        </TouchableOpacity>
                        <SupplierEditModal
                            visible={supplierModalVisible}
                            onSupplierSelect={setSelectedSupplier}
                            onClose={() => setSupplierModalVisible(false)}
                            id={purchaseInvoice[0]?.supplierId}
                        />
                    </View>

                    {selectedSupplier && (
                        <View className="bg-gray-100 p-2 rounded-xl mt-4">
                            <Text className="text-black text-lg">Supplier: {selectedSupplier.name}</Text>
                            <Text className="text-black text-lg">Email: {selectedSupplier.email}</Text>
                            <Text className="text-black text-lg">Phone: {selectedSupplier.phone}</Text>
                        </View>
                    )}

                    {/* Add Product */}
                    <View className="bg-gray-100 p-2 rounded-xl mt-4">
                        <TouchableOpacity
                            className="flex-row justify-between items-center"
                            onPress={() => setPurchaseItemModalVisible(true)}
                        >
                            <Text className="text-black text-lg">Add Product</Text>
                            <EvilIcons name="chevron-right" size={24} color="black" />
                        </TouchableOpacity>
                        {selectedItems?.map((item) => (
                            <TouchableOpacity onPress={() => {
                                setPurchaseItemDetailsModalVisible(true)
                                setSelectedItemId(item);
                            }} className="flex-row justify-between border-b  border-gray-300 py-2 pr-2">
                                <View className=''>
                                    <Text>{item.name}</Text>
                                    <Text>Qty :{item.quantity}</Text>
                                </View>
                                <Text>₹{item.sellingPrice}</Text>
                            </TouchableOpacity>
                        ))}
                        <PurchaseItemDetailsEditModel visible={purchaseItemDetailsModalVisible} onClose={() => { setPurchaseItemDetailsModalVisible(false) }} item={selectedItemId} onUpdate={handleItemUpdate} />

                        {selectedItems?.length > 0 && (
                            <View>
                                <View className="flex-row justify-end items-center  pt-2">
                                    <Text>Subtotal</Text>
                                    <Text>{subtotal}</Text>
                                </View>
                                <View className="flex-row justify-end items-center  pt-2">
                                    <Text>CGST (9%):</Text>
                                    <Text>{cgst}</Text>
                                </View>
                                <View className="flex-row justify-end items-center   pt-2">
                                    <Text>SGST (9%):</Text>
                                    <Text>{sgst}</Text>
                                </View>
                                <View className="flex-row justify-end items-center  pt-2">
                                    <Text>Total</Text>
                                    <Text>{total}</Text>
                                </View>
                            </View>

                        )}
                        <PurchaseItemEditModal
                            visible={purchaseItemModalVisible}
                            onClose={() => setPurchaseItemModalVisible(false)}
                            onAddItems={(items) => setSelectedItems(items)}
                        />
                    </View>


                    {/* Total Amount */}


                    {/* Dates and Input Fields */}
                    <View className="bg-gray-100 p-2 rounded-xl mt-4">
                        {/* Invoice Date */}
                        <View className="flex-row justify-between items-center border-b border-gray-300 pb-2">
                            <Text>Invoice Date</Text>
                            <TouchableOpacity onPress={() => setShowInvoiceDatePicker(true)}>
                                <Text>{invoiceDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showInvoiceDatePicker}
                                mode="date"
                                onConfirm={handleInvoiceDateChange}
                                onCancel={() => setShowInvoiceDatePicker(false)}
                            />
                        </View>

                        {/* Due Date */}
                        <View className="flex-row justify-between items-center border-b border-gray-300 pb-2 mt-4">
                            <Text>Due Date</Text>
                            <TouchableOpacity onPress={() => setShowDueDatePicker(true)}>
                                <Text>{dueDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showDueDatePicker}
                                mode="date"
                                onConfirm={handleDueDateChange}
                                onCancel={() => setShowDueDatePicker(false)}
                            />
                        </View>

                        {/* Invoice Number */}
                        <View className="flex-row justify-between items-center border-b border-gray-300 pb-2 mt-4">
                            <Text>Invoice Number</Text>
                            <TextInput
                                className="flex-1 text-right"
                                placeholder="Enter invoice number"
                                value={invoiceNumber}

                                onChangeText={setInvoiceNumber}
                            />
                        </View>

                        {/* Order Number */}
                        <View className="flex-row justify-between items-center border-b border-gray-300 pb-2 mt-4">
                            <Text>Order Number</Text>
                            <TextInput
                                className="flex-1 text-right"
                                placeholder="Enter order number"
                                value={orderNumber}
                                onChangeText={setOrderNumber}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PurchaseEdit;
