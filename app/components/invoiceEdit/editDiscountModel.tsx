import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

interface DiscountTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: { discount: number; taxRate: number }) => void;
  currentValues: { discount: number; taxRate: number };
}

const EditDiscountTaxModal: React.FC<DiscountTaxModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentValues,
}) => {
  const [discount, setDiscount] = useState<number>(currentValues.discount || 0);
  const [taxRate, setTaxRate] = useState<number>(currentValues.taxRate || 18);

  const handleSave = () => {
    if (isNaN(discount) || discount < 0 || isNaN(taxRate)) {
      alert("Please enter valid values.");
      return;
    }

    onSave({ discount, taxRate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="w-4/5 bg-white rounded-lg p-6">
          <Text className="text-lg font-bold mb-4">Edit Discount & Tax</Text>
          
          {/* Discount Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold mb-2">Discount (%)</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 text-base"
              keyboardType="numeric"
              value={String(discount)}
              onChangeText={(value) => setDiscount(Number(value))}
              placeholder="Enter discount"
            />
          </View>

          {/* Tax Rate Selection */}
          <View className="mb-6">
            <Text className="text-sm font-semibold mb-2">Tax Rate (%)</Text>
            <View className="flex-row">
              {[12, 18, 28].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  onPress={() => setTaxRate(rate)}
                  className={`px-4 py-2 mr-2 rounded-md ${
                    taxRate === rate ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text className={taxRate === rate ? "text-white" : "text-black"}>{rate}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
              <Text className="text-black">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="px-4 py-2 bg-blue-500 rounded-md">
              <Text className="text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditDiscountTaxModal;
