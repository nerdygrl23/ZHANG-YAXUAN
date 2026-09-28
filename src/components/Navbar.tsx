import React from 'react';
import { Mic, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { AppLanguage, BaoVoiceState } from '../hooks/useBaoVoice';
import { YAXUAN_PROFILE } from '../data/yaxuanProfile';

interface NavbarProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  voiceState: BaoVoiceState;
  onVoiceToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  voiceState,
  onVoiceToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EDE4D8] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Monogram & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#DFD3C3] shadow-xs flex items-center justify-center font-serif text-lg font-semibold text-[#6E4B28] tracking-wider">
            ZY
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#1F1B18] font-serif">
                ZHANG YAXUAN
              </h1>
              <span className="hidden sm:inline-block text-xs font-normal text-[#8C6239]">
                (张雅轩)
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#8C6239] uppercase tracking-wider">
              Represented by Bao • AI Agent
            </p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-white rounded-lg p-1 border border-[#E5DACD] text-xs font-medium">
            {(['en', 'zh', 'ko', 'fr'] as AppLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === lang
                    ? 'bg-[#8C6239] text-white shadow-2xs'
                    : 'text-[#6B5A4E] hover:text-[#241F1C] hover:bg-[#FAF7F2]'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'zh' ? '中文' : lang === 'ko' ? '한국어' : 'FR'}
              </button>
            ))}
          </div>

          {/* Quick Voice Access Button in Header */}
          <button
            type="button"
            onClick={onVoiceToggle}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
              voiceState === 'listening'
                ? 'bg-[#8C6239] text-white border-[#6E4B28] shadow-sm animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-[#7A5430] text-white border-[#5E3E22]'
                : 'bg-white text-[#7A5430] border-[#E2D6C7] hover:border-[#8C6239] hover:bg-[#FDFBF8]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span className="hidden md:inline">
              {voiceState === 'listening'
                ? 'Listening...'
                : voiceState === 'speaking'
                ? 'Speaking...'
                : 'Talk to Bao'}
            </span>
          </button>

          {/* Contact link */}
          <a
            href={`mailto:${YAXUAN_PROFILE.email}`}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#F8F4EE] border border-[#E2D6C7] text-xs font-medium text-[#5E4839] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </header>
  );
};
