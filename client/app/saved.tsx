import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackToHomeButton from "@/components/BackToHomeButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResultsDisplay from "@/components/ResultsDisplay";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StudyOutputResponse } from "@/api";
import { deleteSavedResult, loadSavedResults } from "@/utils";
export default function SavedScreen() {
  const [savedResults, setSavedResults] = useState<StudyOutputResponse[]>([]);
  const [selectedResult, setSelectedResult] =
    useState<StudyOutputResponse | null>(null);

  useEffect(() => {
    handleLoadSavedResults();
  }, []);

  const handleLoadSavedResults = async () => {
    try {
      const savedResults = await loadSavedResults();
      setSavedResults(savedResults);
    } catch (error) {
      console.error("Error loading saved results:", error);
    }
  };

  const handleDeleteResult = async (index: number) => {
    try {
      const updatedResults = await deleteSavedResult(index);
      setSavedResults(updatedResults);
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  if (selectedResult) {
    return (
      <SafeAreaView className="h-screen bg-dark px-6">
        <TouchableOpacity
          className="flex flex-row items-center mb-14"
          onPress={() => setSelectedResult(null)}
        >
          <MaterialIcons name="chevron-left" size={30} color="#3B82F6" />
          <Text className="text-blue-500 text-xl font-bold">Back to Saved</Text>
        </TouchableOpacity>
        <ResultsDisplay data={selectedResult} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-screen bg-dark px-6">
      <View className="h-16 flex-row justify-between items-center mb-10">
        <BackToHomeButton />
      </View>
      <Text className="text-white text-2xl w-full text-center font-bold mb-6">
        Saved Lectures
      </Text>
      {savedResults.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400 text-lg text-center">
            No saved lectures yet.
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Save results from your recordings to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedResults}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity
                onPress={() => setSelectedResult(item)}
                activeOpacity={0.85}
                className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-lg font-semibold flex-1 mr-2">
                    {item.lectureTitle || `Lecture ${index + 1}`}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteResult(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons name="delete" size={22} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
                  {item.summary || "No summary available"}
                </Text>

                <View className="flex-row justify-between items-center">
                  <Text className="text-blue-400 text-sm">
                    {item.questions?.length || 0} questions
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Tap to view details
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
