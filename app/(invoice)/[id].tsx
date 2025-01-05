import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import jsPDF from 'jspdf';
import InvoicePreview from '../components/invoice/invoicepreview';
import { useUser } from '@clerk/clerk-expo';


interface CompanyDetails {
  companyName: string;
  address: string;
  email: string;
  city: string;
  state: string;
  zip: string;
  contactNumber: string;
  gstNumber: string;
  userId: string;
}


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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useUser();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>()
  const [companyBankDetails, setCompanyBankDetails] = useState();
  const handleOpenPreview = () => {
    setIsModalVisible(true);
  };

  const handleClosePreview = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice?id=${id}`);
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
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payment?invoiceId=${id}`);
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
          ? 'bg-green-500 text-white'
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

  const fetchCompanyDetails = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/company?userId=${userId}`);
      const data = await response.json();
      setCompanyDetails(data?.Company[0])
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchCompanyDetails(user.id);
    }
  }, [user]);

  const fetchCompanyBankDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/bank?companyId=${companyDetails?._id}`
      );
      const data = await response.json();
      setCompanyBankDetails(data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };
  useEffect(() => {
    fetchCompanyBankDetails();
  }, []);

  const handleChangePaymentStatus = async () => {
    const updatedInvoice = { ...invoice, status: 'paid', paymentMethod, paymentDetails };
    setInvoice(updatedInvoice); // Updating the local invoice state

    try {
      // Update invoice status
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/invoice`, {
        method: 'PUT',
        body: JSON.stringify(updatedInvoice),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update invoice status');

      // Create payment entry
      const res2 = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payment`, {
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

  function createPrintableInvoice() {
    if (!invoice) return '';

    const customer = invoice.customerId || {};
    const items = invoice.items || [];

    // Calculate total, CGST, SGST, and Grand Total
    let total = 0;
    let cgst = 0;
    let sgst = 0;

    items.forEach(item => {
      const itemSubtotal = item.sellingPrice * item.quantity;
      total += itemSubtotal;
      cgst += itemSubtotal * 0.09; // 9% CGST
      sgst += itemSubtotal * 0.09; // 9% SGST
    });

    const grandTotal = total + cgst + sgst;

    return `
      <html>
        <head>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .invoice-container {
              padding: 20px;
              width: 100%;
              box-sizing: border-box;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .brand-header {
              display: flex;
              align-items: center;
            }
            .brand-logo {
              width: 50px;
              height: 50px;
              background-color: #4f46e5;
              border-radius: 4px;
              margin-right: 10px;
            }
            .brand-name {
              font-size: 24px;
              font-weight: bold;
              color: #4f46e5;
            }
            .invoice-details {
              text-align: right;
            }
            .invoice-details div {
              margin-bottom: 5px;
            }
            .company-details {
              display: flex;
              justify-content: space-between;
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .company-details div {
              font-size: 14px;
            }
            .table-container {
              margin-bottom: 20px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .invoice-table th {
              background-color: #f3f4f6;
              font-size: 14px;
              font-weight: bold;
            }
            .invoice-totals {
              text-align: right;
              margin-top: 10px;
            }
            .invoice-totals div {
              margin-bottom: 5px;
            }
            .footer {
              text-align: start;
              margin-top: 30px;
              font-size: 12px;
              color: #6b7280;
            }
              .bank{
              margin-top:20px
              }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="brand-header">
                <div class="brand-logo"></div>
                <div class="brand-name">${companyDetails?.companyName}</div>
              </div>
              <div class="invoice-details">
                <div><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</div>
                <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
              </div>
            </div>
  
            <!-- Company Details -->
            <div class="company-details">
              <div>
                <strong>${companyDetails?.companyName}</strong><br>
                ${companyDetails?.city}<br>
                ${companyDetails?.address}, ${companyDetails?.zip}<br>
                ${companyDetails?.gstNumber}<br>
                ${companyDetails?.email}<br>
                ${companyDetails?.contactNumber}<br>
              </div>
              <div>
                <strong>Customer Company</strong><br>
                ${customer.fullName || 'N/A'}<br>
                ${customer.address || 'N/A'}<br>
                ${customer.city || 'N/A'}, ${customer.state || 'N/A'}<br>
                Phone: ${customer.phone || 'N/A'}
              </div>
            </div>
  
            <!-- Invoice Table -->
            <div class="table-container">
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Details</th>
                    <th>hsn code</th>
                    <th>Price</th>
                    <th>Qty.</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item?.itemId?.name}</td>
                      <td>${item?.itemId?.hsnCode}</td>
                      <td>₹${item.sellingPrice.toFixed(2)}</td>
                      <td>${item.quantity}</td>
                      <td>${item.sellingPrice}</td>
                      <td>₹${(item.sellingPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ` ).join('')}
                </tbody>
              </table>
            </div>

            <!-- Totals Section -->
            <div class="invoice-totals">
              <!-- Subtotal -->
              <div class="flex justify-between mb-1">
                <span class="text-xs text-gray-500">Subtotal:</span>
                <span class="text-xs font-medium">₹${total.toFixed(2)}</span>
              </div>
  
              <!-- CGST (9%) -->
              <div class="flex justify-between mb-1">
                <span class="text-xs text-gray-500">CGST (9%):</span>
                <span class="text-xs font-medium">₹${cgst.toFixed(2)}</span>
              </div>
  
              <!-- SGST (9%) -->
              <div class="flex justify-between mb-1">
                <span class="text-xs text-gray-500">SGST (9%):</span>
                <span class="text-xs font-medium">₹${sgst.toFixed(2)}</span>
              </div>
  
              <!-- Grand Total -->
              <div class="flex justify-between border-t border-gray-300 pt-1">
                <span class="text-sm font-semibold">Grand Total:</span>
                <span class="text-sm font-semibold text-indigo-500">₹${grandTotal.toFixed(2)}</span>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="footer">
             ${companyDetails?.companyName}<br>
              ${companyDetails?.address}<br>
              ${companyDetails?.contactNumber}
           <div class='bank'>
              <strong>Bank Details:</strong><br>
              Bank: ${companyBankDetails?.bankName || 'N/A'}<br>
              Account Number: ${companyBankDetails?.accountNumber || 'N/A'}<br>
              IFSC Code: ${companyBankDetails?.ifscCode || 'N/A'}<br>
              Branch: ${companyBankDetails?.accountName || 'N/A'}<br>
            </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }


  // Print the invoice
  const handlePrint = async () => {
    const htmlContent = createPrintableInvoice();
    await Print.printAsync({
      html: htmlContent,
    });
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    console.log(doc);
    doc.html(createPrintableInvoice(), {
      callback: (doc) => {
        doc.save(`invoice-${invoice?.invoiceNumber}.pdf`);
      },
    });  
  };


  return (
    <SafeAreaView edges={['top', 'left', 'right']} className=" flex-1 bg-gray-800">
      {/* Header */}
      <View className="bg-gray-800 p-3 ">
        <View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/invoice')}>
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
            onPress={() => handlePrint()}
          />
          <ActionButton
            label="Delete"
            icon={<MaterialIcons name="delete-outline" size={20} color="#EF4444" />}
            onPress={() => console.log('Delete')}
          />
          <ActionButton
            label="Download"
            icon={<Feather name="download" size={20} color="#6B7280" />}
            onPress={() => handleDownloadInvoice()}
          />
          <ActionButton
            label="Share"
            icon={<Feather name="share" size={20} color="#6B7280" />}
            onPress={() => console.log('Share')}
          />
          <ActionButton
            label="preview"
            icon={<EvilIcons name={'eye'} size={24} color="#6B7280" />}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      </View>

      <ScrollView className="bg-white">
        {/* Invoice Information */}
        <View className="bg-gray-100 p-4  rounded-lg mx-3 mt-4 gap-2">

          <View className="flex-row justify-between gap-1">
            <Text className="text-black">Invoice Date:</Text>
            <Text className="text-black font-medium">{new Date(invoice?.invoiceDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-black">Due Date:</Text>
            <Text className="text-black font-medium">{new Date(invoice?.dueDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-black">Status:</Text>
            <StatusBadge status={invoice?.status} />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-black">
              Due: ₹{Number(paymentStatus[0]?.payment) - Number(paymentStatus[0]?.amountPaid)}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/invoiceEdit/${invoice._id}`)}
              activeOpacity={0.7} // Adds touch feedback
              className="flex-row items-center gap-1"
            >
              <EvilIcons name="pencil" size={16} />
              <Text className="text-blue-600">Edit</Text>
            </TouchableOpacity>

          </View>


          {/* Change Payment Status Button */}
          {invoice?.status !== 'paid' && (
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(true)}
              className="mt-4 px-6 py-3 bg-green-800 rounded-lg text-white font-medium"
            >
              <Text className='text-white text-center'>Mark as Paid</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items Section */}
        <View className="bg-gray-100  rounded-lg mx-3 mt-4 p-4">
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

      <InvoicePreview visible={isModalVisible} onClose={handleClosePreview} invoice={invoice} />
    </SafeAreaView>
  );
}
export default InvoiceDetails