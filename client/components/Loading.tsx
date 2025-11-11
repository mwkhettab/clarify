import { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

interface LoadingScreenProps {
  continueLoading?: boolean;
  onFinish?: () => void;
}

export default function LoadingScreen({
  continueLoading = false,
  onFinish,
}: LoadingScreenProps) {
  const [progress] = useState(new Animated.Value(0));
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0.8,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (continueLoading) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !hasFinished) {
          setHasFinished(true);
          onFinish?.();
        }
      });
    }
  }, [continueLoading]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-950 justify-center items-center px-6">
      <FontAwesome
        name="spinner"
        size={64}
        color="white"
        className="mb-8 animate-spin"
      />
      <Text className="text-white text-xl mb-6">
        Generating your insights...
      </Text>
      <View className="w-72 h-4 bg-blue-500/20 rounded-full overflow-hidden">
        <Animated.View
          style={{ width }}
          className="h-4 bg-blue-500 rounded-full"
        />
      </View>
    </SafeAreaView>
  );
}
