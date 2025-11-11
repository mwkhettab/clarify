import AsyncStorage from "@react-native-async-storage/async-storage";
import { StudyOutputResponse } from "./api";

export const STORAGE_KEYS = {
  MAX_RECORDING_LENGTH: "max_recording_length",
  AUTO_SAVE: "auto_save",
};

export const loadSettings = async () => {
  try {
    const savedMaxLength = await AsyncStorage.getItem(
      STORAGE_KEYS.MAX_RECORDING_LENGTH
    );
    const maxRecordingLength =
      savedMaxLength !== null ? parseInt(savedMaxLength, 10) : 30;

    const savedAutoSave = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
    const autoSave = savedAutoSave !== null ? savedAutoSave === "true" : false;

    return { maxRecordingLength, autoSave };
  } catch (error) {
    console.error("Error loading settings:", error);
    return { maxRecordingLength: 30, autoSave: false };
  }
};

export const saveMaxRecordingLength = async (length: number) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.MAX_RECORDING_LENGTH,
      length.toString()
    );
  } catch (error) {
    console.error("Error saving max recording length:", error);
  }
};

export const saveAutoSave = async (autoSave: boolean) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SAVE, autoSave.toString());
  } catch (error) {
    console.error("Error saving auto save setting:", error);
  }
};

export const saveResults = async (resultsData: StudyOutputResponse) => {
  try {
    const existingSaves = await AsyncStorage.getItem("savedResults");
    const saves = existingSaves ? JSON.parse(existingSaves) : [];
    saves.push(resultsData);
    await AsyncStorage.setItem("savedResults", JSON.stringify(saves));
  } catch (error) {
    console.error("Error saving results:", error);
  }
};

export const loadSavedResults = async (): Promise<StudyOutputResponse[]> => {
  try {
    const existingSaves = await AsyncStorage.getItem("savedResults");
    const saves = existingSaves ? JSON.parse(existingSaves) : [];
    return saves;
  } catch (error) {
    console.error("Error loading saved results:", error);
    return [];
  }
};

export const deleteSavedResult = async (index: number) => {
  try {
    const existingSaves = await AsyncStorage.getItem("savedResults");
    const saves = existingSaves ? JSON.parse(existingSaves) : [];
    const updatedResults = saves.filter((_: any, i: number) => i !== index);
    await AsyncStorage.setItem("savedResults", JSON.stringify(updatedResults));
    return updatedResults;
  } catch (error) {
    console.error("Error deleting result:", error);
  }
};
