import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import { SafeAreaView } from 'react-native-safe-area-context';

const InvoiceDetails = () => {
  const { id } = useLocalSearchParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [paymentStatus, setPaymentStatus] = useState([]);
  const router = useRouter();



  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/invoice?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch invoice details');
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        setError('Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInvoiceDetails();
  }, [id]);

  useEffect(() => {
    const fetchInvoicePayment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/payment?invoiceId=${id}`);
        if (!res.ok) throw new Error('Failed to fetch invoice details');
        const data = await res.json();
        setPaymentStatus(data);
      } catch (err) {
        setError('Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInvoicePayment();
  }, [id]);

  const formatCurrency = (value) => `₹${value?.toLocaleString()}`;

  const ActionButton = ({ label, icon, onPress }) => (
    <TouchableOpacity
      className="flex-1 items-center justify-center p-3 bg-gray-100 rounded-lg mx-1"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text className="text-xs text-gray-600 mt-1">{label}</Text>
    </TouchableOpacity>
  );

  const StatusBadge = ({ status }) => {
    const statusStyles =
      status === 'unpaid'
        ? 'bg-red-100 text-red-600'
        : status === 'paid'
          ? 'bg-green-100 text-green-600'
          : 'bg-yellow-100 text-yellow-600';

    return (
      <View className={`px-3 py-1 rounded-full ${statusStyles}`}>
        <Text className="text-xs font-medium">{status}</Text>
      </View>
    );
  };

  const handleCustomerClick = () => {
    router.push(`/customer/${invoice?.customerId?._id}`);
  };


  const handleChangePaymentStatus = async () => {
    const updatedInvoice = { ...invoice, status: 'paid', paymentMethod, paymentDetails };
    setInvoice(updatedInvoice); // Updating the local invoice state

    try {
      // Update invoice status
      const res = await fetch(`http://localhost:3000/api/invoice`, {
        method: 'PUT',
        body: JSON.stringify(updatedInvoice),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update invoice status');

      // Create payment entry
      const res2 = await fetch(`http://localhost:3000/api/payment`, {
        method: 'POST',
        body: JSON.stringify({
          invoiceId: invoice._id,  // Ensure this is correctly populated
          customerId: invoice.customerId._id,  // Ensure this is correctly populated
          amountPaid: paymentDetails,  // Ensure this contains the correct amount
          paymentMethod,  // Ensure this matches the valid enum values
          payment: invoice?.total,  // Ensure this contains the correct payment information
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(invoice?.total);
      if (!res2.ok) throw new Error('Failed to create payment entry');

    } catch (error) {
      console.error('Error updating payment status:', error);
      // You can handle the error further, e.g., show a toast or modal for the user
    }

    // Close modal after handling
    setPaymentModalVisible(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="text-gray-500 text-lg mt-3">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="px-4 py-2 bg-gray-800 rounded"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className=" flex-1 bg-gray-800">
      {/* Header */}
      <View className="bg-gray-800 p-3 ">
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <EvilIcons name='arrow-left' size={24} color={'white'} />
          </TouchableOpacity>
        </View>
        <View className='flex justify-center items-center mb-5'>
          <Text className="text-gray-300 text-xl ">INV-{invoice?.invoiceNumber}</Text>
          <TouchableOpacity onPress={handleCustomerClick}>
            <Text className="text-gray-400 text-lg">{invoice?.customerId?.fullName || 'N/A'}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex justify-center px-1 ">
          <ActionButton
            label="Print"
            icon={<Feather name="printer" size={20} color="#6B7280" />}
            onPress={() => console.log('Print')}
          />
          <ActionButton
            label="Delete"
            icon={<MaterialIcons name="delete-outline" size={20} color="#EF4444" />}
            onPress={() => console.log('Delete')}
          />
          <ActionButton
            label="Download"
            icon={<Feather name="download" size={20} color="#6B7280" />}
            onPress={() => console.log('Download')}
          />
          <ActionButton
            label="Share"
            icon={<Feather name="share" size={20} color="#6B7280" />}
            onPress={() => console.log('Share')}
          />
        </View>
      </View>

      <ScrollView className="bg-white">
        {/* Invoice Information */}
        <View className="bg-white p-4 shadow-sm rounded-lg mx-3 mt-4 space-y-3">

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Invoice Date:</Text>
            <Text className="text-gray-800 font-medium">{new Date(invoice?.invoiceDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Due Date:</Text>
            <Text className="text-gray-800 font-medium">{new Date(invoice?.dueDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Status:</Text>
            <StatusBadge status={invoice?.status} />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">
              Due: ₹{Number(paymentStatus[0]?.payment) - Number(paymentStatus[0]?.amountPaid)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/invoiceEdit/${invoice._id}`)}
              activeOpacity={0.7} // Adds touch feedback
              className="flex-row items-center space-x-2"
            >
              <EvilIcons name="pencil" size={16} />
              <Text className="text-blue-600">Edit</Text>
            </TouchableOpacity>

          </View>


          {/* Change Payment Status Button */}
          {invoice?.status !== 'paid' && (
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(true)}
              className="mt-4 px-6 py-3 bg-green-700 rounded-lg text-white font-medium"
            >
              <Text className='text-white text-center'>Mark as Paid</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items Section */}
        <View className="bg-white shadow-sm rounded-lg mx-3 mt-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Items</Text>
          <FlatList
            data={invoice?.items}
            keyExtractor={(item) => item._id}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
                <View>
                  <Text className="text-gray-800 font-medium">{item?.itemId?.name || 'Unknown Item'}</Text>
                  <Text className="text-gray-500 text-sm">
                    {item.quantity} x {formatCurrency(item?.sellingPrice)}
                  </Text>
                </View>
                <Text className="text-gray-700 font-medium">
                  {formatCurrency(item?.quantity * item?.sellingPrice)}
                </Text>
              </View>
            )}
            ListFooterComponent={
              <View className="mt-6 space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="text-gray-800 font-medium">{formatCurrency(invoice?.subtotal)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tax</Text>
                  <Text className="text-gray-800 font-medium">{formatCurrency(invoice?.tax)}</Text>
                </View>
                <View className="flex-row justify-between pt-3 border-t border-gray-200">
                  <Text className="text-gray-800 font-bold text-lg">Total</Text>
                  <Text className="text-gray-800 font-bold text-lg">{formatCurrency(invoice?.total)}</Text>
                </View>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-80">
            <Text className="text-lg font-bold text-gray-800 mb-4">Payment Details</Text>
            <View className="space-y-3">
              <Text className="text-gray-600">Select Payment Method</Text>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                className="border border-gray-300 rounded-lg p-2"
              >
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Card" value="card" />
                <Picker.Item label="UPI" value="upi" />
                <Picker.Item label="Bank Transfer" value="bank_transfer" />
              </Picker>

              <Text className="text-gray-600">Payment Details</Text>
              <TextInput
                value={paymentDetails}
                onChangeText={setPaymentDetails}
                placeholder="Enter payment details"
                className="border border-gray-300 rounded-lg p-2"
              />
            </View>
            <TouchableOpacity
              onPress={handleChangePaymentStatus}
              className="mt-4 px-6 py-3 bg-green-700 rounded-lg text-white"
            >
              <Text className="text-white font-medium">Confirm Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(false)}
              className="mt-2 px-6 py-3 bg-gray-300 rounded-lg"
            >
              <Text className="text-gray-800">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
export default InvoiceDetails