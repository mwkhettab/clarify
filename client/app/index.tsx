import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "@/components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
} from "expo-audio";
import IconButton from "@/components/IconButton";
import { loadSettings } from "@/utils";

export default function HomeScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const [maxRecordingLength, setMaxRecordingLength] = useState(30);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await loadSettings();
        setMaxRecordingLength(settings.maxRecordingLength);
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };
    fetchSettings();
    AsyncStorage.getItem("hasSeenSplash").then(async (value) => {
      if (value === "true") {
        setHasSeenSplash(true);
      } else {
        setHasSeenSplash(false);
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
        shouldPlayInBackground: true,
      });
    });
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      router.push({
        pathname: "/results",
        params: { recordingUri: uri },
      });
      setIsRecording(false);
    } else {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record({
        forDuration: maxRecordingLength * 60,
      });

      console.log("Recording started");
      setIsRecording(true);
    }
  };

  if (hasSeenSplash === false) {
    return (
      <SplashScreen
        onFinish={() => {
          AsyncStorage.setItem("hasSeenSplash", "true");
          setHasSeenSplash(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950 px-6">
      <View className="flex flex-row justify-between items-center mb-8 mt-2">
        <IconButton href="/settings" icon="settings" />
        <IconButton href="/saved" icon="history" />
      </View>

      <View className="flex-1 justify-center items-center">
        <Pressable
          onPress={() => toggleRecording()}
          className="justify-center items-center"
        >
          <View
            className={`absolute rounded-full border-2 w-52 h-52 transition-all duration-300 ease-in-out animate-pulse ${
              isRecording ? "border-red-400/30" : "border-neutral-950"
            }`}
          />
          <View
            className={`absolute rounded-full border-2 w-64 h-64 transition-all duration-300 ease-in-out animate-pulse ${
              isRecording ? "border-red-400/30" : "border-neutral-950"
            }`}
          />

          <View
            className={`rounded-full border-4 shadow-2xl justify-center items-center w-40 h-40 transition-all duration-300 ease-in-out ${
              isRecording
                ? "border-red-400 bg-red-500/20 shadow-red-400"
                : "border-blue-500 bg-blue-500/10 shadow-blue-500"
            }`}
          >
            <MaterialIcons
              name={isRecording ? "stop" : "mic"}
              size={60}
              color="white"
            />
          </View>
        </Pressable>

        <Text className="text-center text-white leading-7 px-4 mt-28 text-xl">
          {isRecording
            ? "Recording... Tap to stop."
            : "Tap to record your lecture."}
        </Text>
      </View>

      <View className="mb-8 items-center">
        <Text className="text-gray-400 text-base">Powered by Clarify</Text>
      </View>
    </SafeAreaView>
  );
}
