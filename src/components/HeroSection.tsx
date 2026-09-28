import React from 'react';
import { Sparkles, Volume2, Globe, MapPin, Award, CheckCircle } from 'lucide-react';
import { ProminentVoiceButton } from './ProminentVoiceButton';
import { AppLanguage, BaoVoiceState } from '../hooks/useBaoVoice';
import { YAXUAN_PROFILE } from '../data/yaxuanProfile';

interface HeroSectionProps {
  language: AppLanguage;
  voiceState: BaoVoiceState;
  transcript: string;
  onVoiceToggle: () => void;
  onPlayGreeting: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  voiceState,
  transcript,
  onVoiceToggle,
  onPlayGreeting,
  onSelectPrompt,
}) => {
  return (
    <section className="relative pt-8 pb-14 sm:pb-20 overflow-hidden">
      {/* Subtle ivory background accent */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#FAF4EC]/60 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top editorial kicker in warm brown */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DACD] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6239]">
              Executive Agent Bao Online
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8C6239] font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Busan & Paris
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D6C7B7]" />
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Top Academic Honors
            </span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typography & Bao Introduction */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8C6239] mb-2">
                EXECUTIVE DOSSIER & AI REPRESENTATIVE
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1C1815] tracking-tight font-medium leading-[1.1]">
                ZHANG YAXUAN
              </h1>
              <p className="text-sm sm:text-base font-serif italic text-[#6E5545] mt-1">
                张雅轩 • Global Business & International Area Studies Scholar
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#3D332D] leading-relaxed max-w-xl font-normal">
              Master’s scholar at <strong className="font-semibold text-[#1C1815]">Pusan National University</strong> (GPA 4.38/4.5) and exchange fellow at <strong className="font-semibold text-[#1C1815]">ESCE Paris Campus</strong>, specializing in cross-border trade, Singapore market expansion, and cultural dynamics.
            </p>

            {/* Bao Welcome Banner with Audio Greeting */}
            <div className="p-5 rounded-2xl bg-white border border-[#EDE4D8] shadow-xs relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5ECE0] border border-[#DFCFC0] flex items-center justify-center font-serif text-[#7A5430] font-bold text-sm shrink-0">
                    包
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1815] flex items-center gap-1.5">
                      <span>Bao — Yaxuan's Personal Agent</span>
                    </h3>
                    <p className="text-xs text-[#8C6239]">
                      Top-down • Straightforward • Welcoming • Multilingual
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onPlayGreeting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E5DACD] text-xs font-semibold text-[#7A5430] transition-colors shrink-0"
                  title="Play Bao's Voice Greeting"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#8C6239]" />
                  <span>Hear Bao</span>
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#F2ECE3]">
                <p className="text-xs sm:text-sm text-[#4E4138] italic font-serif leading-relaxed">
                  "Hello, I am Yaxuan's assistant, what would you like to know about her."
                </p>
                <p className="text-[11px] text-[#A68F7E] mt-1 font-sans">
                  Fluent in: Mandarin (中文) • English • Korean (한국어) • French (Français)
                </p>
              </div>
            </div>

            {/* Quick Interactive Prompt Suggestions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6239]">
                Click or speak to ask:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Tell me about Yaxuan's academic record and GPA",
                  "What did she do in Singapore Business Dispatch?",
                  "Why is she pursuing the ESCE Paris exchange?",
                  "How can I contact Yaxuan?",
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => onSelectPrompt(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF4EC] border border-[#E2D6C7] hover:border-[#8C6239] text-[#544337] transition-all font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Voice Interface & Portrait Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Elegant Portrait Frame */}
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-[#EDE4D8] shadow-sm relative mb-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E8DFD3] flex flex-col justify-end p-5">
                {/* Visual artistic portrait representation */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/80 via-[#1C1815]/20 to-transparent z-10" />

                {/* Profile imagery styling */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#F4EFE6]">
                  {/* Stylized monogram / portrait graphic with ivory editorial look */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-b from-[#EFE8DC] to-[#DCCDC0] flex items-center justify-center text-3xl font-serif font-bold text-[#6E4B28] mb-4">
                      ZY
                    </div>
                    <span className="text-base font-serif font-semibold text-[#3D3027]">
                      Zhang Yaxuan
                    </span>
                    <span className="text-xs text-[#8C6239] font-medium mt-0.5">
                      Busan • Singapore • Paris
                    </span>
                  </div>
                </div>

                {/* Overlay card details */}
                <div className="relative z-20 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>ESCE Paris Exchange Fellow</span>
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white">
                    Master's Scholar in International Area Studies
                  </h4>
                  <p className="text-[11px] text-white/80">
                    Pusan National University (GPA 4.38/4.5)
                  </p>
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#8C6239]">
                <span className="font-semibold">Bao Voice Agent Ready</span>
                <span className="text-[11px] text-[#A68F7E]">Live Gemini Audio</span>
              </div>
            </div>

            {/* THE PROMINENT VOICE BUTTON */}
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-[#E2D4C3] shadow-md hover:shadow-lg transition-all text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6239] block mb-1">
                EASY 1-TAP VOICE CONVERSATION
              </span>
              <p className="text-xs text-[#665345] mb-2">
                Tap the button to speak directly with Bao in any language
              </p>

              <ProminentVoiceButton
                voiceState={voiceState}
                language={language}
                transcript={transcript}
                onToggle={onVoiceToggle}
                size="hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
