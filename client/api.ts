export interface StudyOutputResponse {
  lectureTitle: string;
  transcript?: string;
  summary: string;
  studyActivities: string[];
  questions: {
    question: string;
    answer?: string;
  }[];
  studyPlan: string[];
  recordingUri: string;
}

export const generateStudyMaterial = async (recordingUri: string) => {
  const formData = new FormData();
  console.log("Preparing to upload recording from URI:", recordingUri);
  formData.append("lecture", {
    uri: recordingUri,
    name: "lecture.m4a",
    type: "audio/m4a",
  } as any);

  const response = await fetch("http://localhost:3000/api/lecture/process", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  const data = (await response.json()) as StudyOutputResponse;
  data.recordingUri = recordingUri;
  return data;
};
