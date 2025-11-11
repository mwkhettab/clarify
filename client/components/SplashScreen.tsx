import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { requestRecordingPermissionsAsync } from "expo-audio";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(step, { duration: 400 });
  }, [step]);

  const requestMicPermission = async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      if (status === "granted") {
        nextStep();
      } else {
        alert("Microphone permission denied.");
      }
    } catch (error) {
      console.log("Error requesting microphone permission:", error);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);

  const steps = [
    {
      icon: "school",
      title: "Welcome to Clarify",
      desc: "Record your lectures and get AI-powered feedback instantly.",
      buttons: [{ text: "Next", action: nextStep, primary: true }],
    },
    {
      icon: "analytics",
      title: "How It Works",
      desc: "Clarify lets you record lectures, analyze them with AI, and get actionable feedback to improve your understanding.",
      buttons: [{ text: "Next", action: nextStep, primary: true }],
    },
    {
      icon: "mic",
      title: "Microphone Access",
      desc: "Clarify needs microphone access to record your lectures.",
      buttons: [
        {
          text: "Allow Microphone",
          action: requestMicPermission,
          primary: true,
        },
        { text: "Skip", action: nextStep, primary: false },
      ],
    },
    {
      icon: "check-circle",
      title: "You're All Set!",
      desc: "",
      buttons: [
        { text: "Start Using Clarify", action: onFinish, primary: true },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-950 justify-center items-center px-6">
      {steps.map((s, i) => {
        const style = useAnimatedStyle(() => {
          const offset = (i - step) * width;
          return {
            transform: [{ translateX: withTiming(offset, { duration: 400 }) }],
            opacity: withTiming(i === step ? 1 : 0, { duration: 400 }),
          };
        });

        return (
          <Animated.View
            key={i}
            style={[
              { position: "absolute", width: "100%", alignItems: "center" },
              style,
            ]}
          >
            <MaterialIcons
              name={s.icon as any}
              size={80}
              color="white"
              className="mb-4"
            />
            <Text className="text-white text-3xl font-bold mb-4 text-center">
              {s.title}
            </Text>
            {s.desc ? (
              <Text className="text-gray-300 text-center mb-8">{s.desc}</Text>
            ) : null}
            {s.buttons.map((b, j) => (
              <Pressable
                key={j}
                onPress={b.action}
                className={`px-6 py-3 mb-4 rounded-full shadow-lg ${
                  b.primary ? "bg-blue-500" : "bg-neutral-950 border border-gray-700"
                }`}
              >
                <Text
                  className={
                    b.primary ? "text-white text-lg" : "text-gray-400 text-lg"
                  }
                >
                  {b.text}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        );
      })}
    </SafeAreaView>
  );
}
