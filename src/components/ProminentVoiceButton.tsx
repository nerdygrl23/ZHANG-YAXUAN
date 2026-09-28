import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Loader2, Square } from 'lucide-react';
import { BaoVoiceState, AppLanguage } from '../hooks/useBaoVoice';

interface ProminentVoiceButtonProps {
  voiceState: BaoVoiceState;
  language: AppLanguage;
  transcript: string;
  onToggle: () => void;
  size?: 'hero' | 'floating' | 'compact';
}

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
  fr: 'Français',
};

export const ProminentVoiceButton: React.FC<ProminentVoiceButtonProps> = ({
  voiceState,
  language,
  transcript,
  onToggle,
  size = 'hero',
}) => {
  if (size === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={onToggle}
          aria-label="Voice conversation with Bao"
          className={`group relative flex items-center gap-3 px-5 py-3.5 rounded-full shadow-xl transition-all duration-300 transform active:scale-95 border ${
            voiceState === 'listening'
              ? 'bg-[#8C6239] text-[#FAF8F5] border-[#6E4B28] shadow-[#8C6239]/30 ring-4 ring-[#8C6239]/20 scale-105'
              : voiceState === 'speaking'
              ? 'bg-[#7A5430] text-[#FAF8F5] border-[#5D3F22] shadow-[#7A5430]/30 animate-pulse'
              : voiceState === 'thinking'
              ? 'bg-[#FAF8F5] text-[#7A5430] border-[#D6C7B7] shadow-[#7A5430]/15'
              : 'bg-[#FFFFFF] text-[#4A3525] border-[#E8DFD5] hover:border-[#8C6239] shadow-lg hover:shadow-[#8C6239]/20'
          }`}
        >
          {/* Animated ripple ring when idle or listening */}
          {voiceState === 'listening' && (
            <span className="absolute -inset-1 rounded-full bg-[#8C6239]/30 animate-ping" />
          )}

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              voiceState === 'listening'
                ? 'bg-white text-[#8C6239]'
                : voiceState === 'speaking'
                ? 'bg-[#FAF8F5] text-[#7A5430]'
                : 'bg-[#F5EFE6] text-[#7A5430] group-hover:bg-[#8C6239] group-hover:text-white'
            }`}
          >
            {voiceState === 'listening' ? (
              <Square className="w-4 h-4 fill-current animate-pulse" />
            ) : voiceState === 'thinking' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#8C6239]" />
            ) : voiceState === 'speaking' ? (
              <Volume2 className="w-4 h-4 animate-bounce" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6239]">
              {voiceState === 'listening'
                ? 'Listening...'
                : voiceState === 'thinking'
                ? 'Thinking...'
                : voiceState === 'speaking'
                ? 'Bao speaking'
                : 'Ask Bao'}
            </span>
            <span className="text-sm font-medium leading-none text-[#241F1C]">
              {voiceState === 'listening'
                ? 'Tap to send'
                : voiceState === 'speaking'
                ? 'Tap to pause'
                : `Voice (${LANGUAGE_LABELS[language]})`}
            </span>
          </div>
        </button>
      </div>
    );
  }

  // Hero size: ultra prominent, centered, ivory luxury aesthetics
  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Outer subtle glow rings */}
      <div className="relative flex items-center justify-center my-4">
        {voiceState === 'listening' && (
          <>
            <span className="absolute w-36 h-36 rounded-full bg-[#8C6239]/20 animate-ping" />
            <span className="absolute w-44 h-44 rounded-full bg-[#8C6239]/10 animate-pulse" />
          </>
        )}
        {voiceState === 'speaking' && (
          <span className="absolute w-36 h-36 rounded-full bg-[#8C6239]/15 animate-pulse" />
        )}

        <button
          onClick={onToggle}
          type="button"
          aria-label="Start voice conversation with Bao"
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl border-2 ${
            voiceState === 'listening'
              ? 'bg-[#8C6239] border-[#6E4B28] text-white shadow-[#8C6239]/40 scale-105'
              : voiceState === 'speaking'
              ? 'bg-[#7A5430] border-[#5E3E22] text-[#FAF8F5] shadow-[#7A5430]/35'
              : voiceState === 'thinking'
              ? 'bg-[#FFFFFF] border-[#8C6239] text-[#8C6239] shadow-md'
              : 'bg-gradient-to-b from-[#FFFFFF] to-[#FAF6F0] border-[#DFD3C3] text-[#7A5430] hover:border-[#8C6239] hover:shadow-[#8C6239]/25 hover:scale-102'
          }`}
        >
          {voiceState === 'listening' ? (
            <div className="flex flex-col items-center justify-center">
              <Square className="w-8 h-8 fill-current text-white mb-1" />
              <span className="text-[10px] font-semibold tracking-wider uppercase text-white/90">
                Stop
              </span>
            </div>
          ) : voiceState === 'thinking' ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#8C6239] mb-1" />
              <span className="text-[10px] font-medium tracking-wider uppercase text-[#8C6239]">
                Bao Thinking
              </span>
            </div>
          ) : voiceState === 'speaking' ? (
            <div className="flex flex-col items-center justify-center">
              <Volume2 className="w-8 h-8 text-white animate-pulse mb-1" />
              <span className="text-[10px] font-semibold tracking-wider uppercase text-white/90">
                Speaking
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#8C6239] mb-1 group-hover:bg-[#8C6239] group-hover:text-white transition-colors">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold tracking-wide text-[#7A5430]">
                PRESS TO TALK
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Spoken transcript live badge */}
      {voiceState === 'listening' && (
        <div className="mt-3 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E5DCD2] rounded-full shadow-sm text-center max-w-md animate-fade-in">
          <p className="text-xs text-[#8C6239] font-medium">
            {transcript ? `"${transcript}"` : 'Listening to your voice... Speak now in English, 中文, 한국어, or Français'}
          </p>
        </div>
      )}

      {/* Status caption in warm brown */}
      <div className="text-center mt-3">
        <p className="text-xs sm:text-sm font-medium text-[#8C6239] tracking-wide">
          {voiceState === 'listening'
            ? 'Listening... click button again when finished speaking'
            : voiceState === 'thinking'
            ? 'Bao is formulating a top-down response...'
            : voiceState === 'speaking'
            ? 'Bao is speaking — click button to interrupt'
            : `Voice enabled in Mandarin • English • 한국어 • Français`}
        </p>
        <p className="text-[11px] text-[#A8907C] mt-0.5">
          "Hello, I am Yaxuan's assistant, what would you like to know about her."
        </p>
      </div>
    </div>
  );
};
