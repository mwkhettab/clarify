import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

interface AudioPlayerProps {
  audioUri: string;
  maxRecordingLength?: number;
}

export default function AudioPlayer({ audioUri, maxRecordingLength }: AudioPlayerProps) {
  const player = useAudioPlayer({ uri: audioUri });
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;
  const position = status.currentTime * 1000;
  const duration = status.duration * 1000 || 0;

  const togglePlayPause = () => {
    if (!player) return;

    if (status.didJustFinish) {
      player.seekTo(0);
      player.play();
      return;
    }

    if (isPlaying) player.pause();
    else player.play();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View className="bg-gray-800 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={togglePlayPause}
          className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <View className="flex-1 mx-4">
          <View className="h-1 bg-gray-600 rounded overflow-hidden">
            <View
              className="h-full bg-blue-600"
              style={{
                width: duration > 0 ? `${(position / duration) * 100}%` : "0%",
              }}
            />
          </View>
        </View>

        <Text className="text-gray-400 text-sm">
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}
