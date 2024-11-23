import { Stack } from 'expo-router';
import React from 'react';

const InvoiceLayouts = () => {
    return (
        <Stack>
            {/* CreateInvoice Screen */}
            <Stack.Screen
                name="CreateInvoice"
                options={{
                    title: 'Create Invoice',
                    headerShown: false, // Hide header for CreateInvoice screen
                }}
            />
            {/* InvoiceDetails Screen */}
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Invoice Details',
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#1F2937',
                    },
                    headerTintColor: '#FFFFFF', // White color for the header text and icons
                }}
            />
        </Stack>
    );
};

export default InvoiceLayouts;
