import { useState, useEffect, useRef, useCallback } from 'react';
import { audioController } from '../utils/audioPlayer';

export type BaoVoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type AppLanguage = 'en' | 'zh' | 'ko' | 'fr';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  isGreeting?: boolean;
}

const GREETINGS: Record<AppLanguage, string> = {
  en: "Hello, I am Yaxuan's assistant, what would you like to know about her.",
  zh: '你好，我是雅轩的助理Bao，请问你想了解关于她的什么信息？',
  ko: '안녕하세요, 야쉬안의 어시스턴트 바오입니다. 야쉬안에 대해 어떤 점이 궁금하신가요?',
  fr: "Bonjour, je suis Bao, l'assistante de Yaxuan. Que souhaitez-vous savoir à son sujet ?",
};

export function useBaoVoice(initialLanguage: AppLanguage = 'en') {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage);
  const [voiceState, setVoiceState] = useState<BaoVoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: GREETINGS[initialLanguage],
      timestamp: 'Just now',
      isGreeting: true,
    },
  ]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const currentLangRef = useRef<AppLanguage>(initialLanguage);
  currentLangRef.current = language;

  // Update greeting when language changes if only the greeting is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'greeting') {
        return [
          {
            id: 'greeting',
            role: 'assistant',
            content: GREETINGS[language],
            timestamp: 'Just now',
            isGreeting: true,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  // Speak a text using backend TTS or browser fallback
  const speakText = useCallback(
    async (text: string, langToUse?: AppLanguage) => {
      const activeLang = langToUse || currentLangRef.current;
      if (isMuted) return;

      setVoiceState('speaking');
      audioController.stop();

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: 'Kore', // warm professional female voice
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audio) {
            await audioController.playPcmBase64(data.audio, data.sampleRate || 24000);
            setVoiceState('idle');
            return;
          }
        }
        // Fallback to browser voice if TTS server returned non-200 or no audio
        audioController.speakWithBrowser(text, activeLang, () => {
          setVoiceState('idle');
        });
      } catch (err) {
        console.warn('TTS playback error, falling back to browser speech:', err);
        audioController.speakWithBrowser(text, activeLang, () => {
          setVoiceState('idle');
        });
      }
    },
    [isMuted]
  );

  // Send a user prompt (from voice or text) to Bao via /api/chat
  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setTranscript('');
      setVoiceState('thinking');
      audioController.stop();

      const langMap: Record<AppLanguage, string> = {
        en: 'English',
        zh: 'Mandarin Chinese',
        ko: 'Korean',
        fr: 'French',
      };

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: userText.trim(),
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            language: langMap[currentLangRef.current],
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        const reply = data.reply || "Hello, I am Yaxuan's assistant, what would you like to know about her.";

        const assistantMsg: ChatMessage = {
          id: `bao-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        await speakText(reply, currentLangRef.current);
      } catch (error: any) {
        console.error('Chat error:', error);
        setErrorMessage('Failed to connect to Bao. Retrying...');
        const fallbackMsg: ChatMessage = {
          id: `bao-err-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm right here. As Yaxuan's executive assistant, I'm pleased to tell you about her dual Master's and Bachelor's degrees, her research in Singapore, or her Paris exchange.",
          timestamp: 'Now',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setVoiceState('idle');
      }
    },
    [messages, speakText]
  );

  // Setup Web Speech Recognition for prominent voice button
  const startListening = useCallback(() => {
    // If currently speaking, stop speech first
    if (voiceState === 'speaking') {
      audioController.stop();
      setVoiceState('idle');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. You can type to Bao below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap: Record<AppLanguage, string> = {
        en: 'en-US',
        zh: 'zh-CN',
        ko: 'ko-KR',
        fr: 'fr-FR',
      };
      recognition.lang = langMap[currentLangRef.current] || 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setVoiceState('listening');
        setTranscript('');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          const finalText = currentTranscript.trim();
          if (finalText) {
            sendMessage(finalText);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Mic error: ${event.error}`);
        }
        setVoiceState('idle');
        isListeningRef.current = false;
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setVoiceState('idle');
      setErrorMessage('Could not access microphone. Please check permissions.');
    }
  }, [voiceState, sendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    isListeningRef.current = false;
    setVoiceState('idle');
  }, []);

  const toggleVoice = useCallback(() => {
    if (voiceState === 'listening') {
      stopListening();
    } else if (voiceState === 'speaking') {
      audioController.stop();
      setVoiceState('idle');
    } else {
      startListening();
    }
  }, [voiceState, startListening, stopListening]);

  const playGreetingAudio = useCallback(() => {
    speakText(GREETINGS[language], language);
  }, [language, speakText]);

  return {
    language,
    setLanguage,
    voiceState,
    transcript,
    messages,
    isMuted,
    setIsMuted,
    errorMessage,
    sendMessage,
    startListening,
    stopListening,
    toggleVoice,
    playGreetingAudio,
    greeting: GREETINGS[language],
  };
}
