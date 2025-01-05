import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { printToFileAsync } from 'expo-print';


const PurchaseInvoiceInfo = () => {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    interface InvoiceItem {
        description: string;
        quantity: number;
        price: number;
        productId: {
            name: string;
            sellingPrice: number;
        };
    }

    interface InvoiceData {
        invoiceNumber: string;
        supplierName: string;
        purchaseDate: string;
        dueDate: string;
        totalAmount: number;
        invoiceStatus: string;
        items: InvoiceItem[];
    }

    const [invoiceData, setInvoiceData] = useState<InvoiceData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchInvoiceData(id);
        }
    }, [id]);
    console.log(
        invoiceData
    );
    

    const fetchInvoiceData = async (invoiceId) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice?id=${invoiceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice data');
            }
            const data = await response.json();
            setInvoiceData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-red-500 text-lg">Error: {error}</Text>
            </View>
        );
    }

    if (!invoiceData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-gray-500 text-lg">No Invoice Data Found</Text>
            </View>
        );
    }

    const generatePDF = async () => {
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Modern Invoice</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 40px 0;
              color: #1e293b;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              padding: 48px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 48px;
            }
            .header h1 {
              font-size: 36px;
              font-weight: 700;
              color: #0f172a;
              margin: 0;
            }
            .company-logo {
              font-size: 24px;
              font-weight: 600;
              color: #3b82f6;
            }
            .invoice-details {
              background-color: #f1f5f9;
              border-radius: 8px;
              padding: 24px;
              margin-bottom: 36px;
            }
            .invoice-details p {
              margin: 0 0 12px;
              display: flex;
              justify-content: space-between;
            }
            .invoice-details p:last-child {
              margin-bottom: 0;
            }
            .invoice-details span {
              font-weight: 600;
            }
            .items table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0 8px;
            }
            .items th {
              background-color: #e2e8f0;
              color: #475569;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.05em;
              padding: 12px;
              text-align: left;
            }
            .items td {
              background-color: #f8fafc;
              padding: 16px 12px;
            }
            .items tr:nth-child(even) td {
              background-color: #f1f5f9;
            }
            .items tr td:first-child {
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            .items tr td:last-child {
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
              text-align: right;
            }
            .totals {
              display: flex;
              justify-content: flex-end;
              align-items: flex-start;
              margin-top: 36px;
              padding-top: 24px;
              border-top: 2px solid #e2e8f0;
            }
            .totals table {
              width: 100%;
              max-width: 300px;
            }
            .totals td {
              padding: 8px 0;
            }
            .totals td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .totals .grand-total {
              font-size: 20px;
              font-weight: 700;
              color: #0f172a;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #64748b;
              margin-top: 48px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
              <div class="company-logo">{Your Company Name}</div>
            </div>
            <div class="invoice-details">
              <p><span>Invoice Number:</span> #${invoiceData[0].invoiceNumber}</p>
              <p><span>Supplier:</span> ${invoiceData[0].supplierName}</p>
              <p><span>Date:</span> ${new Date(invoiceData[0].purchaseDate).toLocaleDateString()}</p>
              <p><span>Due Date:</span> ${new Date(invoiceData[0].dueDate).toLocaleDateString()}</p>
            </div>
            <div class="items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceData[0].items
                    .map(
                      (item, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${item.productId.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.productId.sellingPrice.toFixed(2)}</td>
                        <td>₹${(item.quantity * item.productId.sellingPrice).toFixed(2)}</td>
                      </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
            <div class="totals">
              <table>
                <tr>
                  <td>Subtotal:</td>
                  <td>₹${invoiceData[0].totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Tax (0%):</td>
                  <td>₹0.00</td>
                </tr>
                <tr class="grand-total">
                  <td>Total:</td>
                  <td>₹${invoiceData[0].totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </body>
        </html>
        `;
        
        try {
          const { uri } = await printToFileAsync({ html: htmlContent });
          console.log('PDF file saved to:', uri);
          return uri;
        } catch (error) {
          console.error('Error generating PDF:', error);
          throw error;
        }
      };


    const handleAction = (action) => {
        if (action === 'Edit') {
            router.push(`/purchaseEdits/${id}`);
        }
        if (action === 'Delete') {
            const res = fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice?id=${id}`, {
                method: 'DELETE',
            }).then(() => {
                navigation.goBack();
            });
        }
        if (action === 'Share') {
            const sharePDF = async () => {
                const pdfPath = await generatePDF();
                if (pdfPath) {
                    await shareAsync(pdfPath, { mimeType: 'application/pdf' });
                } else {
                    alert('Failed to generate PDF');
                }
            };
            sharePDF();

        }
        if (action === 'Download') {
            const downloadPDF = async () => {
                const pdfPath = await generatePDF();
                if (pdfPath) {
                    const downloadPath = `${FileSystem.documentDirectory}invoice_${invoiceData[0].invoiceNumber}.pdf`;
                    await FileSystem.copyAsync({ from: pdfPath, to: downloadPath });
                    alert(`Invoice downloaded to ${downloadPath}`);
                } else {
                    alert('Failed to generate PDF');
                }
            };
            downloadPDF();
        }

    }

    const hanldePayment = (status: string) => {
        const res = fetch(`${process.env.EXPO_PUBLIC_API_URL}/purchase-invoice?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                invoiceStatus: status,
            }),
        });
        fetchInvoiceData(id);
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="p-4">
                {/* Header */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                            <Ionicons name="arrow-back" size={24} color="#4b5563" />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold text-gray-800">Invoice Details</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between mb-6">
                    {['Edit', 'Delete', 'Share', 'Download'].map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            className="bg-blue-500 rounded-lg px-4 py-2 flex-1 mx-1 items-center"
                            onPress={() => handleAction(action)}
                        >
                            <Ionicons name={getIconName(action)} size={20} color="#FFF" />
                            <Text className="text-white text-xs mt-1">{action}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Invoice Overview */}
                <View className="bg-gray-100 rounded-lg p-4 mb-4">
                    <Text className="text-lg font-medium text-gray-800 mb-3">Invoice Overview</Text>
                    {[
                        { label: 'Invoice Number', value: invoiceData[0].invoiceNumber },
                        { label: 'Supplier', value: invoiceData[0].supplierName },
                        { label: 'Purchase Date', value: new Date(invoiceData[0].purchaseDate).toLocaleDateString() },
                        { label: 'Due Date', value: new Date(invoiceData[0].dueDate).toLocaleDateString() },
                        { label: 'Total Amount', value: `₹${invoiceData[0].totalAmount}` },
                    ].map(({ label, value }, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between py-2 border-b border-gray-200 "
                        >
                            <Text className="text-gray-600 text-sm">{label}</Text>
                            <Text className="text-gray-800 font-medium text-sm">{value}</Text>
                        </View>
                    ))}
                </View>

                {/* Payment Details */}
                <View className="bg-gray-100 rounded-lg  p-4 mb-4">
                    <View className=''>
                        {invoiceData[0].invoiceStatus === 'not paid' ? (
                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-lg font-medium text-gray-800 ">Payment Details</Text>
                                <TouchableOpacity onPress={() => hanldePayment('paid')} className='bg-blue-500 rounded-lg px-4 py-2 items-center'>
                                    <Text className='text-white'>Mark as Paid</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row justify-between py-2 border-b border-gray-200">
                                <Text className="text-lg font-medium text-gray-800 ">Payment Details</Text>
                                <TouchableOpacity onPress={() => hanldePayment('not paid')} className='bg-blue-500 rounded-lg px-4 py-2 items-center'>
                                    <Text className='text-white'>Mark as Not Paid</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View className="flex-row justify-between py-2 border-b border-gray-200">
                        <Text className="text-gray-600 text-sm">Status</Text>
                        <Text
                            className={`text-sm font-medium ${invoiceData[0].invoiceStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}
                        >
                            {invoiceData[0].invoiceStatus}
                        </Text>
                    </View>
                    <View className="flex-row justify-between py-2">
                        <Text className="text-gray-600 text-sm">Balance</Text>
                        <Text className="text-gray-800 font-medium text-sm">₹{invoiceData[0].totalAmount}</Text>
                    </View>
                </View>

                {/* Items List */}
                <View className="bg-gray-100 rounded-lg  p-4">
                    <Text className="text-lg font-medium text-gray-800 mb-3">Items</Text>
                    {invoiceData[0]?.items?.map((item, index) => {
                        const totalAmount = item.quantity * item.productId.sellingPrice;
                        return (
                            <View key={index} className="border-b border-gray-200 pb-4 mb-4 ">
                                <Text className="text-gray-800 font-medium text-sm">{item.productId.name}</Text>
                                <Text className="text-gray-600 text-sm">Quantity: {item.quantity}</Text>
                                <Text className="text-gray-600 text-sm">Rate: ₹{item.productId.sellingPrice}</Text>
                                <Text className="text-gray-800 font-medium text-sm">Total: ₹{totalAmount}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const getIconName = (action) => {
    switch (action) {
        case 'Edit':
            return 'pencil';
        case 'Delete':
            return 'trash';
        case 'Share':
            return 'share';
        case 'Download':
            return 'download';
        default:
            return 'document';
    }
};

export default PurchaseInvoiceInfo;
