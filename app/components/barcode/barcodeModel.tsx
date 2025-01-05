import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const BarcodeModal = ({ visible, onClose, barcodeValue }) => {
    const barcodeRef = useRef(null);

    // Capture the barcode image
    const captureBarcode = async () => {
        if (barcodeRef.current && barcodeRef.current.capture) {
            const uri = await barcodeRef.current.capture();
            return uri;
        } else {
            console.error('capture method not available on barcodeRef.current');
        }
    };

    // Handle print functionality
    const handlePrint = async () => {
        try {
            const uri = await captureBarcode();
            if (uri) {
                // Wrap the image in an HTML template
                const htmlContent = `
                    <html>
                        <body style="text-align: center;">
                            <h1>Product Barcode</h1>
                            <img src="${uri}" style="width: 100%;" />
                        </body>
                    </html>
                `;

                // Print the HTML content
                await Print.printAsync({ html: htmlContent });
            }
        } catch (error) {
            console.error('Error while printing:', error);
        }
    };

    const handleDownload = async () => {
        try {
            const uri = await captureBarcode();
            if (uri) {
                // Directly save the captured barcode image to the app's document directory
                const fileUri = FileSystem.documentDirectory + 'barcode.png';
                
                // Move the file from the captured URI to the document directory (direct save)
                await FileSystem.copyAsync({
                    from: uri,
                    to: fileUri,
                });
                // Optionally, share the saved image
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(fileUri);
                } else {
                    Alert.alert('Sharing not available', 'This device does not support sharing.');
                }
            }
        } catch (error) {
            console.error('Error while downloading:', error);
            Alert.alert('Error', 'Failed to download the barcode.');
        }
    };
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-white bg-opacity-50">
                <View className="bg-white rounded-lg p-5 w-4/5 shadow-lg">
                    <Text className="text-lg font-semibold text-center mb-4">Product Barcode</Text>

                    {barcodeValue ? (
                        <ViewShot
                            ref={barcodeRef}
                            options={{ format: 'png', quality: 0.9 }}
                        >
                            <Barcode
                                value={barcodeValue}
                                format="CODE128"
                                width={1}
                                height={50}
                            />
                        </ViewShot>
                    ) : (
                        <Text className="text-center text-gray-500">No barcode available</Text>
                    )}

                    <View className="mt-5 flex flex-row justify-between">
                        <TouchableOpacity
                            onPress={handlePrint}
                            className="bg-blue-600 py-2 px-4 rounded-md"
                        >
                            <Text className="text-white font-semibold">Print</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleDownload}
                            className="bg-green-600 py-2 px-4 rounded-md"
                        >
                            <Text className="text-white font-semibold">Download</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-gray-500 py-2 px-4 rounded-md"
                        >
                            <Text className="text-white font-semibold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BarcodeModal;
