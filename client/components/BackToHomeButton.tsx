import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function BackToHomeButton() {
  return (
    <Link href="/" asChild>
      <TouchableOpacity className="flex flex-row items-center">
        <MaterialIcons name="chevron-left" size={30} color="#3B82F6" />
        <Text className="text-blue-500 text-xl font-bold">Back to Home</Text>
      </TouchableOpacity>
    </Link>
  );
}
