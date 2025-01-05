import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const CustomerEditModal = ({ modalVisible, setModalVisible, customerData, }) => {
    const { user } = useUser();


    // State for the customer being edited
    const [customer, setCustomer] = useState({
        ...customerData,
        userId: user?.id || "",
    });

    // Handle input changes
    const handleChange = (name, value) => {
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    // Update customer logic
    const handleUpdateCustomer = async () => {
        console.log(customer?._id);

        try {
            const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/customer?id=${customer._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(customer),
                    headers: { "Content-Type": "application/json" },
                }
            );

            const updatedCustomer = await res.json();

            if (res.ok) {
                setModalVisible(false);
            } else {
                console.error("Error updating customer:", updatedCustomer.message);
            }
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

   

    // Cancel logic
    const handleCancel = () => {
        setModalVisible(false);
    };

    console.log(customer.zip);

    return (
        <SafeAreaView className="flex-1">
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View className="flex-1 bg-gray-100">
                    {/* Modal Header */}
                    <View className="mt-16 p-4 flex-row justify-between items-center">
                        <Text className="text-black text-xl font-bold">Edit Customer</Text>
                        <TouchableOpacity onPress={handleCancel}>
                            <Text className="text-blue-700 text-lg font-semibold">Close</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView className="p-6 space-y-6">
                        {/* Customer Form Section */}
                        <Text className="text-gray-600 font-semibold text-lg">
                            Personal Information
                        </Text>
                        <View className="bg-white p-4 rounded-lg">
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="user" size={20} color="gray" />
                                <TextInput
                                    placeholder="Full Name"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.fullName}
                                    onChangeText={(value) => handleChange("fullName", value)}
                                />
                            </View>
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="mail" size={20} color="gray" />
                                <TextInput
                                    placeholder="Email"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.email}
                                    onChangeText={(value) => handleChange("email", value)}
                                />
                            </View>
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="phone" size={20} color="gray" />
                                <TextInput
                                    placeholder="Phone"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.phone}
                                    onChangeText={(value) => handleChange("phone", value)}
                                />
                            </View>
                        </View>

                        <Text className="text-gray-600 font-semibold text-lg">
                            Address Information
                        </Text>
                        <View className="bg-white p-4 rounded-lg shadow-sm">
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="map-pin" size={20} color="gray" />
                                <TextInput
                                    placeholder="Address"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.address}
                                    onChangeText={(value) => handleChange("address", value)}
                                />
                            </View>
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="home" size={20} color="gray" />
                                <TextInput
                                    placeholder="City"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.city}
                                    onChangeText={(value) => handleChange("city", value)}
                                />
                            </View>
                            <View className="flex-row items-center mb-4 border-b border-gray-300">
                                <Feather name="flag" size={20} color="gray" />
                                <TextInput
                                    placeholder="State"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer.state}
                                    onChangeText={(value) => handleChange("state", value)}
                                />
                            </View>
                            <View className="flex-row items-center border-b border-gray-300">
                                <Feather name="hash" size={20} color="gray" />
                                <TextInput
                                    placeholder="Zip Code"
                                    className="flex-1 ml-3 py-3 text-gray-700"
                                    value={customer?.zip}
                                    onChangeText={(value) => handleChange("zip", value)}
                                />
                            </View>
                        </View>

                        {/* Buttons for saving or canceling */}
                        <View className="flex flex-row justify-between mt-6">
                            <TouchableOpacity
                                className="bg-blue-500 w-36 py-3 rounded-lg flex justify-center items-center"
                                onPress={handleUpdateCustomer}
                            >
                                <Text className="text-white font-semibold">Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CustomerEditModal;
