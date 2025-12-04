import { View, Text, Switch, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useState, useEffect } from "react";
import { loadSettings, saveAutoSave, saveMaxRecordingLength } from "@/utils";

export default function SettingsScreen() {
  const [maxRecordingLength, setMaxRecordingLength] = useState(30);
  const [autoSave, setAutoSave] = useState(false);
  const [tempLength, setTempLength] = useState("30");

  useEffect(() => {
    handleLoadSettings();
  }, []);

  const handleLoadSettings = async () => {
    try {
      const settings = await loadSettings();
      setMaxRecordingLength(settings.maxRecordingLength);
      setAutoSave(settings.autoSave);
      setTempLength(settings.maxRecordingLength.toString());
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSaveMaxRecordingLength = async () => {
    const length = parseInt(tempLength, 10);

    if (isNaN(length) || length < 1 || length > 30) {
      Alert.alert("Invalid Input", "Please enter a number between 1 and 30", [
        { text: "OK" },
      ]);

      setTempLength(maxRecordingLength.toString());
      return;
    }

    try {
      setMaxRecordingLength(length);
      await saveMaxRecordingLength(length);
    } catch (error) {
      console.error("Error saving max recording length:", error);
      setTempLength(maxRecordingLength.toString());
    }
  };

  const handleLengthChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setTempLength(numericText);
  };

  const toggleAutoSave = async (value: boolean) => {
    try {
      setAutoSave(value);
      await saveAutoSave(value);
    } catch (error) {
      console.error("Error saving auto save setting:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 px-6 pt-6">
        <BackToHomeButton />

        <View className="mt-10">
          <Text className="text-2xl font-bold text-white w-full text-center mb-8">
            Settings
          </Text>

          <View className="mb-8">
            <Text className="text-lg text-white mb-4">
              Max Recording Length (1-30 minutes)
            </Text>

            <View className="flex-row items-center">
              <TextInput
                className="flex-1 bg-gray-800 p-4 rounded-lg border border-gray-600 text-white text-lg"
                value={tempLength}
                onChangeText={handleLengthChange}
                onBlur={handleSaveMaxRecordingLength}
                onSubmitEditing={handleSaveMaxRecordingLength}
                keyboardType="numeric"
                maxLength={2}
                returnKeyType="done"
                selectTextOnFocus
              />
              <Text className="text-white text-lg ml-2">minutes</Text>
            </View>

            <Text className="text-gray-400 text-sm mt-2">
              Enter a value between 1 and 30 minutes
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg text-white">Auto Save</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Automatically save recordings
              </Text>
            </View>

            <Switch
              value={autoSave}
              onValueChange={toggleAutoSave}
              trackColor={{ false: "#374151", true: "#3B82F6" }}
              thumbColor={autoSave ? "#ffffff" : "#f3f4f6"}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
