export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  gpa: string;
  details: string[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  location: string;
  period: string;
  badge?: string;
  highlights: string[];
}

export interface LanguageItem {
  name: string;
  nativeName: string;
  level: string;
  tag: string;
  detail: string;
}

export interface YaxuanProfileData {
  name: string;
  chineseName: string;
  title: string;
  agentName: string;
  email: string;
  phone: string;
  locations: string[];
  objective: string;
  bioSummary: string;
  character: string[];
  literaryInterests: string;
  education: EducationItem[];
  experiences: ExperienceItem[];
  languages: LanguageItem[];
  suggestedQuestions: {
    en: string[];
    zh: string[];
    ko: string[];
    fr: string[];
  };
}

export const YAXUAN_PROFILE: YaxuanProfileData = {
  name: 'Zhang Yaxuan',
  chineseName: '张雅轩',
  title: "Master's Scholar in International Area Studies & Global Business",
  agentName: 'Bao',
  email: 'nerdygrl23@gmail.com',
  phone: '+82 10-8268-6633',
  locations: ['Busan, South Korea', 'Paris, France (ESCE Exchange)'],
  objective:
    'As a Master’s student with an academic background in both Global Business and International Area Studies, I am driven by a deep fascination with international trade and cultural integration. By joining ESCE Paris Campus, my objective is not only to advance my expertise in global business strategies but also to truly immerse myself in the vibrant spirit of Paris.',
  bioSummary:
    'A high-achieving scholar combining rigorous global market acumen (BUFS GPA 4.5/4.5, PNU GPA 4.38/4.5) with international dispatch experience in Singapore and upcoming business development immersion at ESCE Paris. Outside academia, an active freelance photographer examining cross-cultural social dynamics and literature.',
  character: [
    'Empathetic & culturally perceptive',
    'Resilient with disciplined execution',
    'Inherently driven by intellectual curiosity and an open mind',
  ],
  literaryInterests:
    'Explores how classical and contemporary literature shapes modern global governance, international diplomatic relations, and evolving social dynamics.',
  education: [
    {
      degree: "Master's in International Area Studies",
      institution: 'Pusan National University (PNU), South Korea',
      period: 'Expected graduation in 2027',
      gpa: '4.38 / 4.5',
      details: [
        'Specializing in East Asian & European cross-border trade, geopolitical relations, and transnational commerce.',
        'Top percentile academic standing with advanced regional policy analysis.',
      ],
    },
    {
      degree: "Bachelor's Degree in Global Business Administration",
      institution: 'Busan University of Foreign Studies (BUFS)',
      period: '2023 – 2025',
      gpa: '4.5 / 4.5 (Highest Honors)',
      details: [
        'Graduated with an exemplary perfect 4.5/4.5 GPA.',
        'Deep focus on international supply chain, market penetration strategies, and cross-cultural corporate negotiation.',
      ],
    },
  ],
  experiences: [
    {
      role: 'Business Intern — Glocal Marketer Proficiency Program',
      organization: 'Business Dispatch Singapore',
      location: 'Singapore & South Korea',
      period: 'July 2025',
      badge: 'Board of Trustees Authorized',
      highlights: [
        'Selected for an elite global business development program sanctioned directly by the University Board of Trustees at BUFS.',
        'Conducted intensive on-site field market research and consumer behavior analysis across Singapore to assess regional market expansion strategies for emerging product categories.',
        'Delivered strategic briefs on consumer sentiment, retail distribution channels, and cross-border regulatory logistics.',
      ],
    },
    {
      role: 'Exchange Scholar in International Business Development',
      organization: 'ESCE Paris Campus (PNU – ESCE Exchange Program)',
      location: 'Paris, France',
      period: 'September 2026 – Present',
      badge: 'Exchange Fellow',
      highlights: [
        'Selected for the competitive dual-institution exchange between Pusan National University and ESCE International Business School.',
        'Concentrating on European Union market integration, brand globalization, and sustainable business models.',
        'Engaged in multilingual team case studies analyzing European-Asian bilateral commerce.',
      ],
    },
    {
      role: 'Part-Time Freelance Photographer',
      organization: 'Independent Photography Portfolio',
      location: 'Busan • Singapore • Paris',
      period: 'September 2026 – Present',
      badge: 'Creative Practice',
      highlights: [
        'Specializes in documentary street photography, architectural character studies, and human portraits across East Asia and Europe.',
        'Explores how urban spaces and literary heritage influence local identities and communal dialogue.',
      ],
    },
  ],
  languages: [
    {
      name: 'Mandarin',
      nativeName: '普通话 / 中文',
      level: 'Native Fluency',
      tag: 'C2 Native',
      detail: 'Mother tongue, professional nuance in written and verbal business communications.',
    },
    {
      name: 'English',
      nativeName: 'English',
      level: 'Fluent C1 Level',
      tag: 'IELTS 7.5',
      detail: 'Professional business fluency, academic research writing, and global dispatch leadership.',
    },
    {
      name: 'Korean',
      nativeName: '한국어',
      level: 'Conversational / Elementary Proficiency',
      tag: 'Practical Fluency',
      detail: 'Academic living in Busan (PNU & BUFS), daily conversational and campus navigation.',
    },
    {
      name: 'French',
      nativeName: 'Français',
      level: 'Immersion & Study',
      tag: 'ESCE Paris Track',
      detail: 'Active immersion and business terminology study for ESCE Paris exchange.',
    },
  ],
  suggestedQuestions: {
    en: [
      "Tell me about Yaxuan's academic record and GPA.",
      "What was her role at Business Dispatch Singapore?",
      "Why is she participating in the ESCE Paris exchange?",
      "How do her photography and literature interests connect to business?",
      "How can I contact Yaxuan for collaboration?",
    ],
    zh: [
      "请介绍一下雅轩的学业背景与GPA成绩。",
      "她在新加坡的商业实习负责了哪些重点工作？",
      "雅轩为什么选择去巴黎ESCE商学院交换？",
      "她的摄影作品与文学研究有什么特色？",
      "如何联系雅轩商谈学术或工作机会？",
    ],
    ko: [
      "야쉬안의 부산대와 부산외대 학업 성적 및 GPA를 알려줘.",
      "싱가포르 글로벌 마케터 프로그램에서 어떤 역할을 했나요?",
      "파리 ESCE 교환학생 프로그램에 참여하는 이유는 무엇인가요?",
      "야쉬안의 사진 활동과 문학에 대한 관심은 어떤 내용인가요?",
      "야쉬안에게 협업 문의를 하려면 어떻게 연락하나요?",
    ],
    fr: [
      "Pouvez-vous me présenter le parcours académique de Yaxuan et ses notes ?",
      "Quel a été son rôle lors de son stage à Singapour ?",
      "Pourquoi a-t-elle rejoint le programme d'échange ESCE Paris ?",
      "Comment ses projets photographiques enrichissent-ils sa vision ?",
      "Comment puis-je contacter Yaxuan pour une opportunité ?",
    ],
  },
};
