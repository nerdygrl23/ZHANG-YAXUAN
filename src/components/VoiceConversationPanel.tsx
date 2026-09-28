import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Mic, Sparkles, RefreshCw, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { AppLanguage, BaoVoiceState, ChatMessage } from '../hooks/useBaoVoice';
import { YAXUAN_PROFILE } from '../data/yaxuanProfile';

interface VoiceConversationPanelProps {
  messages: ChatMessage[];
  voiceState: BaoVoiceState;
  language: AppLanguage;
  transcript: string;
  onSendMessage: (msg: string) => void;
  onToggleVoice: () => void;
  onReplayAudio: (text: string) => void;
  onLanguageChange: (lang: AppLanguage) => void;
}

export const VoiceConversationPanel: React.FC<VoiceConversationPanelProps> = ({
  messages,
  voiceState,
  language,
  transcript,
  onSendMessage,
  onToggleVoice,
  onReplayAudio,
  onLanguageChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, voiceState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const sampleQuestions = YAXUAN_PROFILE.suggestedQuestions[language] || YAXUAN_PROFILE.suggestedQuestions.en;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE4D8] shadow-sm overflow-hidden transition-all duration-300">
      {/* Panel Header */}
      <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#EDE4D8] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#EFE8DC] border border-[#D8C7B5] flex items-center justify-center text-[#7A5430] font-semibold text-sm">
              包
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                voiceState === 'listening'
                  ? 'bg-amber-500 animate-pulse'
                  : voiceState === 'speaking'
                  ? 'bg-[#8C6239] animate-ping'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#241F1C] tracking-tight">
                Bao
              </h3>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#F2ECE1] text-[#7A5430] border border-[#DFD3C3]">
                Executive Personal Agent
              </span>
            </div>
            <p className="text-xs text-[#8C6239]">
              Straightforward, top-down briefings for Zhang Yaxuan
            </p>
          </div>
        </div>

        {/* Language selector buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EDE4D8]">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              language === 'en'
                ? 'bg-[#8C6239] text-white shadow-xs'
                : 'text-[#6B5A4E] hover:bg-[#FAF7F2]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('zh')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              language === 'zh'
                ? 'bg-[#8C6239] text-white shadow-xs'
                : 'text-[#6B5A4E] hover:bg-[#FAF7F2]'
            }`}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('ko')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              language === 'ko'
                ? 'bg-[#8C6239] text-white shadow-xs'
                : 'text-[#6B5A4E] hover:bg-[#FAF7F2]'
            }`}
          >
            한국어
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('fr')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              language === 'fr'
                ? 'bg-[#8C6239] text-white shadow-xs'
                : 'text-[#6B5A4E] hover:bg-[#FAF7F2]'
            }`}
          >
            FR
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 p-1 text-[#8C6239] hover:bg-[#FAF7F2] rounded-lg transition-colors"
            aria-label="Toggle panel"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {/* Quick topic suggestion pills */}
          <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#EDE4D8] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6239] whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick topics:
            </span>
            {sampleQuestions.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(q)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#F5EFE6] text-[#594436] hover:text-[#7A5430] border border-[#E5DACD] hover:border-[#8C6239] transition-all shadow-2xs font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Conversation history area */}
          <div
            ref={scrollRef}
            className="p-6 space-y-4 max-h-[420px] min-h-[220px] overflow-y-auto bg-gradient-to-b from-white to-[#FDFCFB]"
          >
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-[#F3EDE2] border border-[#DFD3C3] flex items-center justify-center text-[#7A5430] text-xs font-semibold shrink-0 mt-0.5">
                      包
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-[#FAF8F5] border border-[#E8DFD3] text-[#2D2622] rounded-tl-sm'
                        : 'bg-[#7A5430] text-[#FAF8F5] rounded-tr-sm shadow-xs'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#EDE4D8]">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C6239]">
                          Bao (Personal Agent)
                        </span>
                        <button
                          type="button"
                          onClick={() => onReplayAudio(msg.content)}
                          title="Replay voice"
                          className="flex items-center gap-1 text-[11px] text-[#8C6239] hover:text-[#5E3E22] transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}

                    <div className="whitespace-pre-line font-normal">{msg.content}</div>

                    <div
                      className={`text-[10px] mt-2 flex justify-end ${
                        isAssistant ? 'text-[#A08876]' : 'text-white/70'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {voiceState === 'thinking' && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F3EDE2] border border-[#DFD3C3] flex items-center justify-center text-[#7A5430] text-xs font-semibold shrink-0">
                  包
                </div>
                <div className="px-4 py-3 bg-[#FAF8F5] border border-[#E8DFD3] rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8C6239] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#8C6239] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#8C6239] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[#8C6239] font-medium ml-1">
                    Bao is preparing an executive response...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input & voice control bottom bar */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#FAF7F2] border-t border-[#EDE4D8] flex items-center gap-3"
          >
            {/* Direct voice toggle button */}
            <button
              type="button"
              onClick={onToggleVoice}
              aria-label="Toggle voice"
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                voiceState === 'listening'
                  ? 'bg-[#8C6239] text-white border-[#6E4B28] shadow-md ring-2 ring-[#8C6239]/20 animate-pulse'
                  : voiceState === 'speaking'
                  ? 'bg-[#7A5430] text-white border-[#5E3E22]'
                  : 'bg-white text-[#7A5430] border-[#DED3C6] hover:border-[#8C6239] hover:bg-[#FDFBF9]'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  voiceState === 'listening'
                    ? 'Listening... or type message here...'
                    : `Ask Bao about Yaxuan's education, Singapore internship, or Paris exchange...`
                }
                className="w-full bg-white border border-[#DED3C6] focus:border-[#8C6239] focus:ring-2 focus:ring-[#8C6239]/15 rounded-xl px-4 py-2.5 text-sm text-[#2D2622] placeholder:text-[#A08B7A] transition-all outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send query"
              className="p-2.5 rounded-xl bg-[#8C6239] hover:bg-[#724D28] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
