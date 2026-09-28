import React, { useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VoiceConversationPanel } from './components/VoiceConversationPanel';
import { ProfileDetails } from './components/ProfileDetails';
import { ProminentVoiceButton } from './components/ProminentVoiceButton';
import { useBaoVoice } from './hooks/useBaoVoice';
import { YAXUAN_PROFILE } from './data/yaxuanProfile';
import { MessageSquare, Mic, Volume2, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';

export default function App() {
  const {
    language,
    setLanguage,
    voiceState,
    transcript,
    messages,
    sendMessage,
    toggleVoice,
    playGreetingAudio,
    errorMessage,
  } = useBaoVoice('en');

  const conversationSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
    // Smooth scroll to conversation panel if needed
    conversationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAskBaoAbout = (topic: string) => {
    sendMessage(topic);
    conversationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#241F1C] flex flex-col font-sans selection:bg-[#EADBCE] selection:text-[#523A28]">
      {/* Navbar with Monogram, Languages & Quick Mic */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        voiceState={voiceState}
        onVoiceToggle={toggleVoice}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 mt-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Hero Section featuring Zhang Yaxuan & Prominent Voice Button */}
        <HeroSection
          language={language}
          voiceState={voiceState}
          transcript={transcript}
          onVoiceToggle={toggleVoice}
          onPlayGreeting={playGreetingAudio}
          onSelectPrompt={handleSelectPrompt}
        />

        {/* Dedicated Live Voice Conversation Hub */}
        <section
          ref={conversationSectionRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6239] block">
                CONVERSATION WITH BAO
              </span>
              <h2 className="text-2xl font-serif text-[#1C1815]">
                Direct Inquiries & Executive Briefings
              </h2>
            </div>
            <p className="text-xs text-[#7A5C43]">
              Bao provides top-down, efficient briefings in Mandarin, English, Korean, or French.
            </p>
          </div>

          <VoiceConversationPanel
            messages={messages}
            voiceState={voiceState}
            language={language}
            transcript={transcript}
            onSendMessage={sendMessage}
            onToggleVoice={toggleVoice}
            onReplayAudio={playGreetingAudio}
            onLanguageChange={setLanguage}
          />
        </section>

        {/* Full Resume & Dossier Sections for Zhang Yaxuan */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProfileDetails
            language={language}
            onAskBaoAbout={handleAskBaoAbout}
          />
        </div>
      </main>

      {/* Floating Prominent Voice Button for instant access while scrolling */}
      <ProminentVoiceButton
        voiceState={voiceState}
        language={language}
        transcript={transcript}
        onToggle={toggleVoice}
        size="floating"
      />

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-[#EDE4D8] py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8C6239]">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-sm text-[#1F1A17]">
              ZHANG YAXUAN
            </span>
            <span className="text-[#CFC2B4]">|</span>
            <span>Personal Agent: Bao</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`mailto:${YAXUAN_PROFILE.email}`}
              className="hover:text-[#523A28] transition-colors"
            >
              {YAXUAN_PROFILE.email}
            </a>
            <a
              href={`tel:${YAXUAN_PROFILE.phone}`}
              className="hover:text-[#523A28] transition-colors"
            >
              {YAXUAN_PROFILE.phone}
            </a>
            <span>Busan • Paris</span>
          </div>

          <div className="text-[11px] text-[#A68F7E]">
            Designed in minimal ivory & warm brown • Multilingual AI voice enabled
          </div>
        </div>
      </footer>
    </div>
  );
}
