import { View, Text, ScrollView } from "react-native";
import AudioPlayer from "./AudioPlayer";
import { StudyOutputResponse } from "@/api";

interface ResultsDisplayProps {
  data: StudyOutputResponse;
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-white text-2xl font-bold text-center mb-6">
        {data.lectureTitle}
      </Text>

      <View className="mb-6">
        <AudioPlayer audioUri={data.recordingUri} />
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 text-base text-center">
          {data.summary}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-white text-xl font-semibold mb-3">Questions</Text>
        {data.questions.map((q, index: number) => (
          <View key={index} className="mb-4 border-b border-gray-700 pb-2">
            <Text className="text-gray-100 font-semibold">
              Q{index + 1}: {q.question}
            </Text>
            {q.answer && (
              <Text className="text-gray-400 mt-1">A: {q.answer}</Text>
            )}
          </View>
        ))}
      </View>

      <View className="mb-6">
        <Text className="text-white text-xl font-semibold mb-3">
          Study Activities
        </Text>
        {data.studyActivities.map((activity: string, index: number) => (
          <Text key={index} className="text-gray-400 mb-2">
            • {activity}
          </Text>
        ))}
      </View>

      <View className="mb-6">
        <Text className="text-white text-xl font-semibold mb-3">
          Study Plan
        </Text>
        {data.studyPlan.map((step: string, index: number) => (
          <Text key={index} className="text-gray-400 mb-2">
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      {data.transcript && (
        <View className="mb-6">
          <Text className="text-white text-xl font-semibold mb-3">
            Transcript
          </Text>
          <Text className="text-gray-400">{data.transcript}</Text>
        </View>
      )}
    </ScrollView>
  );
}
