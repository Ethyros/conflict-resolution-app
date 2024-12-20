// src/api.js

const API_URL = "https://conflict-resolution-backend.vercel.app";

export const analyzeText = async (text, mode, selectedFramework = null) => {
  try {
    const payload = {
      text,
      mode,
      framework: selectedFramework
    };

    console.log('Making analysis request:', {
      url: `${API_URL}/api/analyze`,
      payload
    });

    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',  // Change this line
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      throw new Error(`Analysis failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis error:', {
      message: error.message,
      status: error.status,
      statusText: error?.statusText,
      url: `${API_URL}/api/analyze`,
      stack: error.stack
    });
    throw error;
  }
};

export const transcribeAudio = async (audioFile) => {
  try {
    const formData = new FormData();
    formData.append('audioFile', audioFile, 'audio.webm');
   
    console.log('Making transcription request:', {
      url: `${API_URL}/api/transcribe`,
      fileSize: audioFile.size,
      fileType: audioFile.type
    });
   
    const response = await fetch(`${API_URL}/api/transcribe`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',  // Changed from 'include' to match analyze endpoint
      body: formData  // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      throw new Error(`Transcription failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};