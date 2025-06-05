import { VoiceCommand } from '../types/agent';

type CommandCallback = (command: string) => void;

interface SpeechRecognitionWithEnd extends SpeechRecognition {
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

class VoiceParser {
  private isListening: boolean = false;
  private recognition: SpeechRecognitionWithEnd | null = null;
  private commandCallback: CommandCallback | null = null;

  constructor(callback?: CommandCallback) {
    if (callback) {
      this.commandCallback = callback;
    }

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = false; // We want final results only

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        this.handleTranscript(transcript);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      this.stop();
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart if we're still supposed to be listening
        this.recognition?.start();
      }
    };
  }

  public start() {
    if (this.isListening || !this.recognition) return;
    console.log("🎤 Voice parser starting...");
    this.isListening = true;
    this.recognition.start();
  }

  public stop() {
    if (!this.isListening || !this.recognition) return;
    console.log("🎤 Voice parser stopped.");
    this.isListening = false;
    this.recognition.stop();
  }

  private handleTranscript(transcript: string) {
    if (this.commandCallback && transcript) {
      this.commandCallback(transcript);
    }
  }
}

let voiceParser: VoiceParser | null = null;

export const loadVoiceParser = (callback?: CommandCallback): VoiceParser => {
  if (!voiceParser) {
    voiceParser = new VoiceParser(callback);
  } else if (callback) {
    // Update callback if provided
    voiceParser = new VoiceParser(callback);
  }
  return voiceParser;
};

export const startVoiceParser = () => voiceParser?.start();
export const stopVoiceParser = () => voiceParser?.stop();
