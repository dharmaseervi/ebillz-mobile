import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const SearchModel = ({ visible, onClose, searchType }) => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [results, setResults] = useState([]);

    // Fetch data based on search type
    const searchData = async () => {
        if (!search.trim()) return;

        setLoading(true);
        try {
            const endpoint =
                searchType === "customer"
                    ? `${process.env.EXPO_PUBLIC_API_URL}/customer?query=${search}`
                    : `${process.env.EXPO_PUBLIC_API_URL}/invoice?query=${search}`;
            const res = await fetch(endpoint);

            if (!res.ok) {
                throw new Error("Failed to fetch results.");
            }

            const data = await res.json();

            if ((data.customers || data)) {
                setResults(data.customers || data);
            } else {
                console.error("No results found.");
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle result click
    const handleResultClick = (item) => {
        if (searchType === "customer") {
            router.push(`/customer/${item._id}`);
        } else {
            router.push(`/(invoice)/${item._id}`);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white pt-14">
                <View className="p-4 rounded-lg">
                    {/* Header */}
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-xl font-semibold">
                            {searchType === "customer" ? "Search Customers" : "Search Invoices"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-xl text-indigo-600">Close</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <TextInput
                        placeholder={
                            searchType === "customer"
                                ? "Search by name or email..."
                                : "Search by invoice number or customer name..."
                        }
                        className="border border-gray-300 rounded-md p-2 mb-4"
                        value={search}
                        onChangeText={setSearch}
                        editable={!loading}
                    />

                    {/* Search Button */}
                    <TouchableOpacity
                        onPress={searchData}
                        disabled={loading}
                        className={`rounded-md p-2 ${loading ? "bg-gray-400" : "bg-indigo-600"
                            }`}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-center text-white text-lg">Search</Text>
                        )}
                    </TouchableOpacity>

                    {/* Results */}
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleResultClick(item)}
                                className="border-b border-gray-300 p-2 mb-2 rounded"
                            >
                                {searchType === "customer" ? (
                                    <>
                                        <Text className="text-lg font-semibold text-gray-800">
                                            {item.fullName}
                                        </Text>
                                        <Text className="text-sm text-gray-600">{item.email}</Text>
                                        <Text className="text-xs text-gray-500">{item.city}</Text>
                                    </>
                                ) : (
                                    <>
                                        <View className="flex-row justify-between">
                                            <Text className="text-lg font-semibold text-gray-800">
                                                INV-{item.invoiceNumber}
                                            </Text>
                                            <Text className="text-sm text-gray-600">
                                                ₹{item.total}
                                            </Text>
                                        </View>
                                        <Text className="text-sm text-gray-600">
                                            {item?.customerId?.fullName}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {new Date(item.invoiceDate).toLocaleDateString()}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            !loading && (
                                <Text className="text-gray-600 text-center mt-4">
                                    No results found.
                                </Text>
                            )
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

export default SearchModel;
