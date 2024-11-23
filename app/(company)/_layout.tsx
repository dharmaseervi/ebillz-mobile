import React from 'react'

import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const InvoiceLayout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="CreateCompany"
                    options={{
                        title: "CreateCompany",
                        headerShown: false,
                    }}
                />
            </Stack>
        </SafeAreaView>
    )
}

export default InvoiceLayout