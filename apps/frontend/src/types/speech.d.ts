// src/types/speech.d.ts

// Minimal Web Speech API types used in GuideChatbot
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

// Core recognition interface
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives?: number;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend?: (ev: Event) => void;
  onaudiostart?: (ev: Event) => void;
  onend?: (ev: Event) => void;
  onerror?: (ev: SpeechRecognitionErrorEvent) => void;
  onnomatch?: (ev: Event) => void;
  onresult?: (ev: SpeechRecognitionEvent) => void;
  onsoundend?: (ev: Event) => void;
  onsoundstart?: (ev: Event) => void;
  onspeechend?: (ev: Event) => void;
  onspeechstart?: (ev: Event) => void;
  onstart?: (ev: Event) => void;
}

// Vendor-prefixed ctor available in Chromium
declare var webkitSpeechRecognition: {
  new(): SpeechRecognition;
};

// Window helpers
declare interface Window {
  SpeechRecognition?: { new(): SpeechRecognition };
  webkitSpeechRecognition?: { new(): SpeechRecognition };
}
