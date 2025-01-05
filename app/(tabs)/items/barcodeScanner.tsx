import React, { useState } from "react";
import { View, Text, Alert, Animated, Button, Dimensions, Vibration, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions, CameraType, BarcodeScanningResult } from "expo-camera";

const { width, height } = Dimensions.get("window");

export default function BarcodeScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasScanned, setHasScanned] = useState(false);
    const [cameraType, setCameraType] = useState<CameraType>("back");
    const [lineAnimation] = useState(new Animated.Value(0));

    // Request Camera Permission
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center px-5">
                <Text className="text-lg text-gray-700 mb-4 text-center">
                    We need your permission to use the camera
                </Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
        if (hasScanned) return;
        setHasScanned(true);

        // Vibration on scan
        Vibration.vibrate([0, 500, 100, 500]);

        Alert.alert("Barcode Scanned", `Type: ${type}\nData: ${data}`);
    };

    // Scanning Line Animation (Adjusted for smaller height)
    const scannerHeight = height * 0.2; // Reduced height (20% of screen height)
    Animated.loop(
        Animated.sequence([
            Animated.timing(lineAnimation, {
                toValue: scannerHeight - 40, // Adjust animation range to fit new height
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(lineAnimation, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }),
        ])
    ).start();

    return (
        <View className="flex-1 relative">
            {/* Camera View */}
            <CameraView
                className="flex-1"
                style={StyleSheet.absoluteFillObject} // Ensures full screen camera
                onCameraReady={() => console.log("Camera is ready")}
                onMountError={(error) => console.log("Camera mount error:", error)}
                onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
                facing={cameraType}
                barcodeScannerSettings={{
                    barcodeTypes: ["code128", "code39", "code93", "qr"],
                }}
            />
            {/* Scanner Overlay */}
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
                <View
                    className="w-[90%] h-[20%] border-2 border-black bg-transparent rounded-md relative" // Adjusted height
                >
                    <Animated.View
                        style={{
                            transform: [{ translateY: lineAnimation }],
                        }}
                        className="absolute w-full h-[0.5px] bg-red-500" // Reduced line height
                    />
                </View>
            </View>

            {/* Footer Buttons */}
            {hasScanned && (
                <View className="absolute bottom-20 w-full flex items-center">
                    <Button title="Scan Again" onPress={() => setHasScanned(false)} />
                </View>
            )}
        </View>
    );
}
