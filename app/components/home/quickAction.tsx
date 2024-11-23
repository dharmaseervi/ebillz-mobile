import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Optional prop for icons
  onPress: () => void;
}

const QuickAction = ({ title, iconName, onPress }: QuickActionProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="w-[48%] mb-4">
      <View className="px-4 py-4 bg-blue-800 flex flex-row space-x-1 items-center rounded">
        {iconName && <Ionicons name={iconName} size={24} color="white" />}
        <Text className="text-lg text-white">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default QuickAction;
