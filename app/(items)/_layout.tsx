import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'

const ItemLayout = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen
                    name="additems"
                    options={{
                        title: "additems",
                        headerShown: false,
                    }}
                />
            </Stack>
        </SafeAreaView>
    )
}

export default ItemLayout