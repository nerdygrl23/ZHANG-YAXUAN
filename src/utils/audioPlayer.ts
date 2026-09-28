// Audio Player utility for Gemini TTS (PCM 24kHz) and browser speech synthesis fallback

class AudioController {
  private ctx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isPlaying = false;
  private onEndCallbacks: (() => void)[] = [];

  private getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass({ sampleRate: 24000 });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Convert raw base64 PCM 16-bit 24kHz mono audio to AudioBuffer
  public async playPcmBase64(base64Data: string, sampleRate = 24000): Promise<void> {
    this.stop();

    try {
      const ctx = this.getAudioContext();
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM little-endian to float32
      const dataView = new DataView(bytes.buffer);
      const numSamples = Math.floor(bytes.byteLength / 2);
      const float32Array = new Float32Array(numSamples);

      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32Array[i] = int16 / 32768.0;
      }

      const buffer = ctx.createBuffer(1, numSamples, sampleRate);
      buffer.copyToChannel(float32Array, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      this.currentSource = source;
      this.isPlaying = true;

      return new Promise<void>((resolve) => {
        source.onended = () => {
          this.isPlaying = false;
          this.currentSource = null;
          this.onEndCallbacks.forEach((cb) => cb());
          this.onEndCallbacks = [];
          resolve();
        };
        source.start();
      });
    } catch (err) {
      console.error('Error playing PCM audio:', err);
      this.isPlaying = false;
      throw err;
    }
  }

  // Fallback to browser SpeechSynthesis if API audio fails or is disabled
  public speakWithBrowser(
    text: string,
    lang: 'en' | 'zh' | 'ko' | 'fr' = 'en',
    onEnd?: () => void
  ): void {
    this.stop();
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: Record<string, string> = {
      en: 'en-US',
      zh: 'zh-CN',
      ko: 'ko-KR',
      fr: 'fr-FR',
    };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.05; // Slightly warm female pitch

    // Try finding a pleasant female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith(langMap[lang]?.slice(0, 2) || 'en') &&
        (v.name.includes('Female') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google') ||
          v.name.includes('Tingting') ||
          v.name.includes('Yuna') ||
          v.name.includes('Amelie') ||
          v.name.includes('Natural'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.isPlaying = true;
    utterance.onend = () => {
      this.isPlaying = false;
      onEnd?.();
    };
    utterance.onerror = () => {
      this.isPlaying = false;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (_) {}
      this.currentSource = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.onEndCallbacks.forEach((cb) => cb());
    this.onEndCallbacks = [];
  }

  public onEnded(callback: () => void): void {
    this.onEndCallbacks.push(callback);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const audioController = new AudioController();
