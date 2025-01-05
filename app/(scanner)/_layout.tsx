import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Scanner = () => {
    return (
        <Stack>
            <Stack.Screen
                name="barcode-reader"
                options={{
                    title: 'scanner',
                    headerShown: false, 
                }}
            />
        </Stack>
    )
}

export default Scanner