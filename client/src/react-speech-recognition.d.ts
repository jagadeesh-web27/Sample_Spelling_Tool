declare module 'react-speech-recognition' {
    export interface SpeechRecognitionResult {
      transcript: string;
      confidence: number;
    }
  
    export interface UseSpeechRecognitionOptions {
      continuous?: boolean;
      language?: string;
    }
  
    export function useSpeechRecognition(options?: UseSpeechRecognitionOptions): {
      transcript: string;
      resetTranscript: () => void;
      listening: boolean;
      browserSupportsSpeechRecognition: boolean;
    };
  
    const SpeechRecognition: {
      startListening: (options?: UseSpeechRecognitionOptions) => void;
      stopListening: () => void;
      abortListening: () => void;
      browserSupportsSpeechRecognition: () => boolean;
    };
  
    export default SpeechRecognition;
  }