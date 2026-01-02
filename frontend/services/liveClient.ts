import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export interface LiveConfig {
  model: string;
  systemInstruction?: string;
}

export class LiveClient {
  private ai: GoogleGenAI;
  private session: any; // LiveSession type from SDK
  private audioContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private onMessageCallback: (text: string, isPartial: boolean) => void;
  private onAudioCallback: (volume: number) => void;
  private onStatusCallback: (connected: boolean) => void;
  private onErrorCallback: (error: string) => void;

  constructor(
    apiKey: string, 
    onMessage: (text: string, isPartial: boolean) => void,
    onAudioLevel: (volume: number) => void,
    onStatus: (connected: boolean) => void,
    onError: (error: string) => void
  ) {
    this.ai = new GoogleGenAI({ apiKey });
    this.onMessageCallback = onMessage;
    this.onAudioCallback = onAudioLevel;
    this.onStatusCallback = onStatus;
    this.onErrorCallback = onError;
  }

  async connect(config: LiveConfig) {
    try {
      // Initialize Audio Context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Connect to Gemini Live
      const sessionPromise = this.ai.live.connect({
        model: config.model,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: config.systemInstruction,
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            this.onStatusCallback(true);
            // Start recording once connected to prevent race conditions
            this.startRecording(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            this.handleServerMessage(message);
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            this.onStatusCallback(false);
            this.disconnect();
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            this.onErrorCallback(err.message || "Connection error");
            this.disconnect();
          },
        },
      });

      this.session = await sessionPromise;

    } catch (error: any) {
      console.error("Failed to connect to Gemini Live", error);
      this.onErrorCallback(error.message);
    }
  }

  private async startRecording(sessionPromise: Promise<any>) {
    if (!this.audioContext) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.inputSource = this.audioContext.createMediaStreamSource(stream);
      
      // Use ScriptProcessor for simplicity in this environment (AudioWorklet preferred for prod)
      // Buffer size 4096 provides a good balance of latency and stability
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
        const volume = Math.sqrt(sum / inputData.length);
        this.onAudioCallback(volume);

        // Downsample to 16kHz for Gemini
        const downsampled = this.downsampleTo16k(inputData, this.audioContext!.sampleRate);
        const pcm16 = this.floatTo16BitPCM(downsampled);
        const base64 = this.arrayBufferToBase64(pcm16.buffer);

        sessionPromise.then((session) => {
            session.sendRealtimeInput({
                mimeType: "audio/pcm;rate=16000",
                data: base64
            });
        });
      };

      this.inputSource.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

    } catch (error: any) {
      console.error("Microphone access failed", error);
      
      let errorMessage = "Microphone access denied";
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Permission denied. Please allow microphone access in your browser settings.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = "No microphone found.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = "Microphone is busy or hardware error.";
      }

      this.onErrorCallback(errorMessage);
    }
  }

  private async handleServerMessage(message: LiveServerMessage) {
    // Handle Text Transcript (if available alongside audio)
    // Note: Current native audio model might prioritize audio back, 
    // but we check for serverContent.modelTurn which might contain text parts or just audio.
    // The SDK often emits audio chunks.
    
    const serverContent = message.serverContent;
    
    if (serverContent?.modelTurn?.parts) {
        for (const part of serverContent.modelTurn.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                // Handle Audio
                const audioData = this.base64ToUint8Array(part.inlineData.data);
                await this.playAudioChunk(audioData);
            }
            if (part.text) {
                this.onMessageCallback(part.text, !serverContent.turnComplete);
            }
        }
    }
    
    if (serverContent?.turnComplete) {
       // Turn is complete
    }
  }

  private async playAudioChunk(data: Uint8Array) {
    if (!this.audioContext) return;

    // Data is Int16 PCM at 24kHz
    const float32 = new Float32Array(data.length / 2);
    const dataView = new DataView(data.buffer);
    
    for (let i = 0; i < data.length / 2; i++) {
        const int16 = dataView.getInt16(i * 2, true); // Little endian
        float32[i] = int16 / 32768;
    }

    const buffer = this.audioContext.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    // Schedule playback
    const currentTime = this.audioContext.currentTime;
    const startTime = Math.max(currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
  }

  disconnect() {
    if (this.session) {
        // The SDK handles WS closure, we just clean up local audio
        this.session = null;
    }
    
    if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
    }
    
    if (this.inputSource) {
        this.inputSource.disconnect();
        this.inputSource = null;
    }

    if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
    }
  }

  // --- Audio Helpers ---

  private downsampleTo16k(samples: Float32Array, sampleRate: number): Float32Array {
    if (sampleRate === 16000) return samples;
    const ratio = sampleRate / 16000;
    const newLength = Math.round(samples.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetSource = 0;
    while (offsetResult < result.length) {
        const nextOffsetSource = Math.round((offsetResult + 1) * ratio);
        let accum = 0, count = 0;
        for (let i = offsetSource; i < nextOffsetSource && i < samples.length; i++) {
            accum += samples[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetSource = nextOffsetSource;
    }
    return result;
  }

  private floatTo16BitPCM(float32: Float32Array): Int16Array {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}