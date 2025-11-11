import { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackToHomeButton from "@/components/BackToHomeButton";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/Loading";
import IconButton from "@/components/IconButton";
import { generateStudyMaterial, StudyOutputResponse } from "@/api";
import ResultsDisplay from "@/components/ResultsDisplay";
import { saveResults, loadSettings } from "@/utils";

export default function ResultsScreen() {
  const { recordingUri } = useLocalSearchParams();
  console.log("Recording URI:", recordingUri);

  const [continueLoading, setContinueLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [resultsData, setResultsData] = useState<StudyOutputResponse | null>(
    null
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [autoSave, setAutoSave] = useState(false);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const settings = await loadSettings();
        setAutoSave(settings.autoSave);
      } catch (error) {
        console.error("Error loading user settings:", error);
      }
    };

    const fetchData = async () => {
      setTimeout(() => {
        generateStudyMaterial(recordingUri as string)
          .then((data) => {
            console.log("API response:", data);
            setResultsData(data);
            setContinueLoading(true);
          })
          .catch((err) => {
            console.error("Error fetching study material:", err);
            setResultsError(err.message || "Unknown error occurred.");
          });
      }, 3000);
    };

    loadUserSettings();
    fetchData();
  }, []);

  useEffect(() => {
    const autoSaveResults = async () => {
      if (resultsData && autoSave && !hasAutoSaved) {
        try {
          await saveResults(resultsData);
          setHasAutoSaved(true);
          setModalMessage(
            "Results automatically saved! (Auto-save is enabled)"
          );
          setModalVisible(true);
        } catch (error) {
          console.error("Error auto-saving results:", error);
          setModalMessage("Auto-save failed. Please try saving manually.");
          setModalVisible(true);
        }
      }
    };

    autoSaveResults();
  }, [resultsData, autoSave, hasAutoSaved]);

  if (!showResults) {
    if (resultsError) {
      return (
        <SafeAreaView className="h-screen bg-neutral-950 px-6">
          <BackToHomeButton />
          <View className="h-[80%] flex justify-center items-center">
            <Text className="text-red-500 text-2xl text-center font-bold">
              An unexpected error occurred!
            </Text>
            <Text className="text-red-400 text-base text-center mt-20">
              {resultsError}
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="h-screen bg-neutral-950">
        <LoadingScreen
          continueLoading={continueLoading}
          onFinish={() => setShowResults(true)}
        />
      </SafeAreaView>
    );
  }

  const handleSaveResults = async () => {
    if (!resultsData) return;

    try {
      await saveResults(resultsData);
      setModalMessage(
        autoSave
          ? "Results saved again! (Auto-save is enabled)"
          : "Results saved successfully!"
      );
      setModalVisible(true);
    } catch (error) {
      console.error("Error saving results:", error);
      setModalMessage(
        "An unexpected error occurred while saving results. Please try again."
      );
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView className="h-screen bg-neutral-950 px-6">
      {/* Header */}
      <View className="h-16 flex-row justify-between items-center">
        <BackToHomeButton />
        <View className="flex-row items-center">
          {autoSave && (
            <Text className="text-green-400 text-sm mr-3">Auto-save ✓</Text>
          )}
          <IconButton onPress={handleSaveResults} icon="save" />
        </View>
      </View>

      {/* Auto-save indicator */}
      {autoSave && hasAutoSaved && (
        <View className="mt-10 bg-green-900/30 border border-green-700 rounded-lg p-3 mb-4">
          <Text className="text-green-400 text-center text-sm">
            Automatically saved - Auto-save is enabled in settings
          </Text>
        </View>
      )}

      {/* Results Display */}
      {resultsData && <ResultsDisplay data={resultsData} />}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-800 rounded-2xl p-6 w-4/5 items-center">
            <Text className="text-white text-lg mb-4 text-center">
              {modalMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
