import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Languages,
  UserCheck,
  Camera,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Award,
  Globe2,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { YAXUAN_PROFILE } from '../data/yaxuanProfile';
import { AppLanguage } from '../hooks/useBaoVoice';

interface ProfileDetailsProps {
  language: AppLanguage;
  onAskBaoAbout: (topic: string) => void;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  language,
  onAskBaoAbout,
}) => {
  return (
    <div className="space-y-12">
      {/* Section 1: Objective & Executive Statement */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE4D8] shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-px bg-[#8C6239]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
              OBJECTIVE & SCHOLARLY PURSUIT
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1815] leading-snug mb-5">
            Advancing international trade strategies through cultural synergy and European immersion.
          </h2>

          <div className="pl-5 border-l-2 border-[#D8C7B5] space-y-3">
            <p className="text-base text-[#423832] leading-relaxed italic font-serif">
              "{YAXUAN_PROFILE.objective}"
            </p>
          </div>

          {/* Quick interactive inquiry trigger */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onAskBaoAbout("Explain Yaxuan's master's research and Paris exchange")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6239] hover:text-[#5E3E22] bg-[#FAF7F2] hover:bg-[#F3ECE1] px-4 py-2 rounded-full border border-[#E5DACD] transition-colors"
            >
              <span>Ask Bao about Yaxuan's Paris Exchange</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Education & Academic Honors */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#8C6239]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
                EDUCATION
              </h3>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif text-[#1F1A17] mt-1">
              Academic Record & International Area Studies
            </h4>
          </div>
          <button
            onClick={() => onAskBaoAbout("Provide a full breakdown of Yaxuan's GPA and academic credentials")}
            className="text-xs font-medium text-[#8C6239] hover:underline hidden sm:block"
          >
            Ask Bao for GPA breakdown →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {YAXUAN_PROFILE.education.map((edu, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-[#EDE4D8] hover:border-[#8C6239] transition-all duration-300 shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs font-semibold text-[#8C6239] uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E8DFD3]">
                    {edu.period}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#E2D4C3] text-[#7A5430] text-xs font-bold">
                    <Award className="w-3.5 h-3.5 text-[#8C6239]" />
                    <span>GPA {edu.gpa}</span>
                  </div>
                </div>

                <h5 className="text-lg font-bold text-[#1F1A17] group-hover:text-[#6E4B28] transition-colors font-serif">
                  {edu.degree}
                </h5>
                <p className="text-sm font-medium text-[#8C6239] mt-1 mb-4">
                  {edu.institution}
                </p>

                <ul className="space-y-2">
                  {edu.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-[#52463E] leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C6239] mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F2ECE3] flex items-center justify-between">
                <span className="text-[11px] text-[#A08876]">
                  {idx === 0 ? 'Pusan National University' : 'BUFS Highest Honors'}
                </span>
                <button
                  type="button"
                  onClick={() => onAskBaoAbout(`Tell me more about ${edu.institution}`)}
                  className="text-xs text-[#8C6239] hover:text-[#5E3E22] font-semibold flex items-center gap-1"
                >
                  <span>Inquire</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Professional Experience & Global Dispatches */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#8C6239]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
                EXPERIENCE & GLOBAL DISPATCH
              </h3>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif text-[#1F1A17] mt-1">
              Field Market Research & Cross-Cultural Strategy
            </h4>
          </div>
          <button
            onClick={() => onAskBaoAbout("Detail Yaxuan's work in Singapore during her Business Dispatch")}
            className="text-xs font-medium text-[#8C6239] hover:underline hidden sm:block"
          >
            Ask Bao about Singapore Dispatch →
          </button>
        </div>

        <div className="space-y-6">
          {YAXUAN_PROFILE.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-[#EDE4D8] hover:border-[#8C6239] transition-all shadow-2xs group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {exp.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C6239] border border-[#E2D4C3]">
                        {exp.badge}
                      </span>
                    )}
                    <span className="text-xs font-medium text-[#8C6239] flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {exp.location}
                    </span>
                  </div>
                  <h5 className="text-lg sm:text-xl font-bold text-[#1F1A17] font-serif">
                    {exp.role}
                  </h5>
                  <p className="text-sm font-semibold text-[#8C6239] mt-0.5">
                    {exp.organization}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs font-semibold text-[#665041] bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#EDE4D8]">
                    {exp.period}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 mt-4 pt-4 border-t border-[#F2ECE3]">
                {exp.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-sm text-[#4A3F37] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C6239] mt-2 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Languages & Global Readiness */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-[#8C6239]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
                LANGUAGES & DIPLOMATIC DIVERSITY
              </h3>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif text-[#1F1A17] mt-1">
              Multilingual Agility for Global Commerce
            </h4>
          </div>
          <button
            onClick={() => onAskBaoAbout('What languages does Yaxuan speak and how fluent is she?')}
            className="text-xs font-medium text-[#8C6239] hover:underline hidden sm:block"
          >
            Ask Bao about language levels →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {YAXUAN_PROFILE.languages.map((lang, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#EDE4D8] hover:border-[#8C6239] transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6239] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DFD3]">
                  {lang.tag}
                </span>
                <span className="text-xs text-[#9E8574] font-medium">
                  {lang.nativeName}
                </span>
              </div>
              <h5 className="text-base font-bold text-[#1F1A17] font-serif">
                {lang.name}
              </h5>
              <p className="text-xs font-semibold text-[#8C6239] mt-0.5 mb-2">
                {lang.level}
              </p>
              <p className="text-xs text-[#594B42] leading-relaxed">
                {lang.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Personal Profile, Literary & Artistic Pursuits */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE4D8] shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="w-5 h-5 text-[#8C6239]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8C6239]">
            PERSONAL PROFILE & ARTISTIC ENDEAVORS
          </h3>
        </div>
        <h4 className="text-2xl font-serif text-[#1F1A17] mb-6">
          Intellectual Curiosity, Resilience & Creative Perception
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Character attributes */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-[#8C6239] flex items-center gap-2">
              <Compass className="w-4 h-4" /> Core Attributes
            </h5>
            <div className="space-y-3">
              {YAXUAN_PROFILE.character.map((char, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE4D8] text-sm font-medium text-[#382E28] flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8C6239]" />
                  <span>{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Literary and Photography Passions */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-[#8C6239] flex items-center gap-2">
              <Camera className="w-4 h-4" /> Literary & Creative Synergy
            </h5>
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EDE4D8] space-y-4">
              <div>
                <span className="text-xs font-bold text-[#8C6239] uppercase tracking-wider block mb-1">
                  Literary & Social Exploration
                </span>
                <p className="text-sm text-[#423832] leading-relaxed">
                  {YAXUAN_PROFILE.literaryInterests}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3]">
                <span className="text-xs font-bold text-[#8C6239] uppercase tracking-wider block mb-1">
                  Documentary Photography
                </span>
                <p className="text-xs text-[#594B42] leading-relaxed">
                  Focuses on the visual narratives of transitioning cityscapes—from the bustling harbor of Busan and commercial nodes of Singapore to the historic architecture of Paris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Direct Contact & Global Base */}
      <section className="bg-gradient-to-br from-[#FAF7F2] to-[#F5ECE1] rounded-3xl p-8 sm:p-10 border border-[#E5DACD] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6239] block mb-1">
              GET IN TOUCH
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif text-[#1F1A17]">
              Connect with Zhang Yaxuan
            </h4>
            <p className="text-sm text-[#665041] mt-1 max-w-lg">
              Open to international business strategy initiatives, global academic research collaborations, and cultural exchange partnerships.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${YAXUAN_PROFILE.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#8C6239] hover:bg-[#724D28] text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{YAXUAN_PROFILE.email}</span>
            </a>
            <a
              href={`tel:${YAXUAN_PROFILE.phone}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#FDFCFB] text-[#5C4535] border border-[#D8C7B5] text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#8C6239]" />
              <span>{YAXUAN_PROFILE.phone}</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#DFD3C3] flex flex-wrap items-center justify-between text-xs text-[#8C6239] gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Locations: Busan, South Korea • Paris, France</span>
          </div>
          <div>
            <span>Executive Representative: Bao (Bilingual AI Assistant)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
