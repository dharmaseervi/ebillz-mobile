import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Dashboard from './dashboard';

const ItemLayout = () => {
    const TopTab = createMaterialTopTabNavigator();

    return (
        <SafeAreaView style={{ flex: 1 }} className="bg-white">
            {/* Stack Navigator for handling screens */}
            <Stack>
                {/* Add Item Screen */}
                <Stack.Screen
                    name="additems"
                    options={{
                        title: "Add Items",
                        headerShown: false,
                    }}
                />
                {/* Edit Item Screen */}
                <Stack.Screen
                    name="[id]"
                    options={{
                        title: "Edit Items",
                        headerShown: false,
                    }}
                />
                {/* Barcode Scanner Screen */}
                <Stack.Screen
                    name="barcodeScanner"
                    options={{
                        title: "Barcode Scanner",
                        headerShown: false,
                    }}
                />

            </Stack>

        </SafeAreaView>
    );
};

export default ItemLayout;
