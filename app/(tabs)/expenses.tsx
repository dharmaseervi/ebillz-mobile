import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpensesModel from '../components/expenses/expensesModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Expenses = () => {
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/expenses`);
      const data = await response.json();
      if (response.ok) {
        setExpenses(data.Expenses); // Assuming the response has an `expenses` field
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch expenses');
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Refresh expenses after modal closes
  const handleModalClose = () => {
    setShowExpensesModal(false);
    fetchExpenses();
  };

  // Render expense item
  const renderExpenseItem = ({ item }) => (
    <View className="border-b border-gray-200 p-1 mb-2 rounded-lg flex-row justify-between">
      <View>
        <Text className="text-lg font-semibold">{item?.category}</Text>
        <Text className="text-sm text-gray-500">{new Date(item?.date).toLocaleDateString()}</Text>
        <Text className="text-sm">{item?.notes}</Text>
      </View>
      <Text className="text-lg font-bold text-blue-700">₹{item?.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Expenses</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderExpenseItem}
          ListEmptyComponent={<Text className="text-center text-gray-500">No expenses found</Text>}
        />
      )}

      <ExpensesModel visible={showExpensesModal} onClose={handleModalClose} />

      <TouchableOpacity
        className="bg-blue-700 p-4 rounded-full absolute bottom-4 right-4"
        onPress={() => setShowExpensesModal(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Expenses;
