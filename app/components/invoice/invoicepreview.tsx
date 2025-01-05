import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity } from "react-native";

interface InvoiceItem {
  productDetails: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number; // optional
}

interface Customer {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
}

interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  customerId: Customer;
  items: InvoiceItem[];
  total: number;
}

interface InvoicePreviewProps {
  visible: boolean;
  onClose: () => void;
  invoice: Invoice;
}

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

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  visible,
  onClose,
  invoice,
}) => {
  if (!invoice) return null;
  const { user } = useUser();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>();
  const [companyBankDetails, setCompanyBankDetails] = useState();

  const fetchCompanyDetails = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/company?userId=${userId}`
      );
      const data = await response.json();
      setCompanyDetails(data?.Company[0]);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };
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
    if (user) {
      fetchCompanyDetails(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (companyDetails?._id) {
      fetchCompanyBankDetails();
    }
  }, [companyDetails]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1  bg-white  px-3">
        <View className="bg-white rounded-lg pt-16 px-1 w-full">
          <ScrollView>
            {/* Brand Header */}
            <View className="flex-row justify-between mb-5">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-indigo-500 rounded-md" />
                <Text className="text-2xl font-bold ml-2">{companyDetails?.companyName}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">Date</Text>
                <Text className="text-sm font-medium">
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </Text>
                <Text className="text-xs text-gray-500 mt-2">Invoice #</Text>
                <Text className="text-sm font-medium text-indigo-500">
                  {invoice.invoiceNumber}
                </Text>
              </View>
            </View>

            {/* Company Details */}
            <View className="flex-row justify-between bg-gray-50 rounded-lg p-4 mb-5">
              <View>
                <Text className="text-sm font-semibold mb-2">
                  {companyDetails?.companyName}
                </Text>
                <Text className="text-xs">{companyDetails?.address}</Text>
                <Text className="text-xs">{companyDetails?.city}</Text>
                <Text className="text-xs">
                  {companyDetails?.state} ,{companyDetails?.zip}
                </Text>
                <Text className="text-xs">{companyDetails?.gstNumber}</Text>
                <Text className="text-xs">{companyDetails?.email}</Text>
                <Text className="text-xs">{companyDetails?.contactNumber}</Text>
              </View>
              <View>
                <Text className="text-sm font-semibold mb-2">Customer</Text>
                <Text className="text-xs">{invoice.customerId?.name}</Text>
                <Text className="text-xs">{invoice.customerId?.address}</Text>
                <Text className="text-xs">
                  {invoice.customerId?.city}, {invoice.customerId?.state}
                </Text>
                <Text className="text-xs">{invoice.customerId?.phone}</Text>
              </View>
            </View>

            {/* Invoice Table */}
            <View className="mb-5">
              <View className="flex-row border-b border-gray-300 pb-2 mb-2">
                <Text className="flex-1 text-xs font-semibold">#</Text>
                <Text className="flex-[2] text-xs font-semibold">Details</Text>
                <Text className="flex-1 text-xs font-semibold">HSN</Text>
                <Text className="flex-1 text-xs font-semibold">Qty</Text>
                <Text className="flex-1 text-xs font-semibold">Rate</Text>
                <Text className="flex-1 text-xs font-semibold">Unit</Text>
                <Text className="flex-1 text-xs font-semibold">Disc</Text>
                <Text className="flex-1 text-xs font-semibold">Amount</Text>
              </View>

              {invoice.items.map((item, index) => {
                const amount = item.quantity * item.sellingPrice;
                const discount = item.discount || 0;
                const amountAfterDiscount = amount - discount;
                const gst = amountAfterDiscount * 0.18; // Assuming 18% GST split into CGST and SGST
                const total = amountAfterDiscount + gst;

                return (
                  <View key={index} className="flex-row border-b border-gray-300 py-2">
                    <Text className="flex-1 text-xs">{index + 1}</Text>
                    <Text className="flex-[2] text-xs">{item?.itemId?.name}</Text>
                    <Text className="flex-1 text-xs">{item?.itemId?.hsnCode}</Text>
                    <Text className="flex-1 text-xs">{item?.quantity}</Text>
                    <Text className="flex-1 text-xs">{item.sellingPrice.toFixed(2)}</Text>
                    <Text className="flex-1 text-xs">{item?.itemId?.unit}</Text>
                    <Text className="flex-1 text-xs">{discount.toFixed(2)}</Text>
                    <Text className="flex-1 text-xs">{amount.toFixed(2)}</Text>
                  </View>
                );
              })}
            </View>

            {/* Totals */}
            <View className="items-end mb-5">
              {/* Subtotal */}
              <View className="flex-row justify-between w-[50%] mb-1">
                <Text className="text-xs text-gray-500">Subtotal:</Text>
                <Text className="text-xs font-medium">
                  ₹
                  {invoice.items
                    .reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0)
                    .toFixed(2)}
                </Text>
              </View>

              {/* CGST */}
              <View className="flex-row justify-between w-[50%] mb-1">
                <Text className="text-xs text-gray-500">CGST (9%):</Text>
                <Text className="text-xs font-medium">
                  ₹
                  {(
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.sellingPrice,
                      0
                    ) * 0.09
                  ).toFixed(2)}
                </Text>
              </View>

              {/* SGST */}
              <View className="flex-row justify-between w-[50%] mb-1">
                <Text className="text-xs text-gray-500">SGST (9%):</Text>
                <Text className="text-xs font-medium">
                  ₹
                  {(
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.sellingPrice,
                      0
                    ) * 0.09
                  ).toFixed(2)}
                </Text>
              </View>

              {/* Grand Total */}
              <View className="flex-row justify-between w-[50%] border-t border-gray-300 pt-1">
                <Text className="text-sm font-semibold">Grand Total:</Text>
                <Text className="text-sm font-semibold text-indigo-500">
                  ₹
                  {(
                    invoice.items.reduce(
                      (sum, item) => sum + item.quantity * item.sellingPrice,
                      0
                    ) * 1.18
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          


            {/* Notes */}
            <View className="mb-5">
              <Text className="text-sm font-semibold mb-2">Notes</Text>
              <Text className="text-xs italic text-gray-500">
                Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
                industries for previewing layouts and visual mockups.
              </Text>
            </View>

            {/* Footer */}
            <View className="border-t border-gray-300 pt-4">
              <Text className="text-xs text-gray-500">{companyDetails?.companyName}</Text>
              <Text className="text-xs text-gray-500">{companyDetails?.email}</Text>
              <Text className="text-xs text-gray-500">{companyDetails?.contactNumber}</Text>

              {/* Bank Details */}
              <Text className="text-xs text-gray-500 mt-2">Bank Name: {companyBankDetails?.bankName}</Text>
              <Text className="text-xs text-gray-500">Account Number: {companyBankDetails?.accountNumber}</Text>
              <Text className="text-xs text-gray-500">IFSC Code:{companyBankDetails?.ifsccode}</Text>
              <Text className="text-xs text-gray-500">Account Name:{companyBankDetails?.accountName}</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} className="bg-red-500 p-3 rounded-md mt-5">
              <Text className="text-white font-medium text-center">Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default InvoicePreview;
