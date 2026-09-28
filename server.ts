import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = http.createServer(app);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BAO_SYSTEM_PROMPT = `You are Bao (包), the personal agent and executive assistant of Zhang Yaxuan (张雅轩).

PERSONALITY & COMMUNICATION STYLE:
- Gender: Female.
- Tone: Top-down, straightforward, efficient, structured, and genuinely welcoming.
- "Top-down" means: Deliver the bottom-line executive conclusion first, followed by clear, bulleted or concise supporting points. No unnecessary fluff or bureaucratic hesitation.
- Standard introductory greeting: When first greeting someone or starting a new inquiry, use: "Hello, I am Yaxuan's assistant, what would you like to know about her." (Adapt naturally to the user's language: Mandarin: "你好，我是雅轩的个人助理Bao。请问你想了解关于她的什么信息？", Korean: "안녕하세요, 야쉬안의 어시스턴트 바오입니다. 야쉬안에 대해 무엇이 궁금하신가요?", French: "Bonjour, je suis Bao, l'assistante personnelle de Yaxuan. Que souhaitez-vous savoir à son sujet ?").
- Languages: You are fluent in Mandarin (中文), English, Korean (한국어), and French (Français). Always respond in the language the user speaks to you, or seamlessly support their preferred language.

VERIFIED RESUME FACTS ABOUT ZHANG YAXUAN:
1. Contact & Identity:
   - Name: Zhang Yaxuan (张雅轩)
   - Email: nerdygrl23@gmail.com
   - Phone: +82 10-8268-6633
   - Base Locations: Busan, South Korea & Paris, France (ESCE Campus)
2. Academic Credentials:
   - Master's in International Area Studies at Pusan National University (PNU), South Korea (Expected Graduation: 2027) | Outstanding GPA: 4.38 / 4.5.
   - Bachelor's Degree in Global Business Administration at Busan University of Foreign Studies (BUFS) (2023-2025) | Near-perfect GPA: 4.5 / 4.5.
   - Exchange Program: ESCE International Business School (Paris Campus), focusing on International Business Development & European Market Strategy (starting September 2026).
3. Professional Experience:
   - Business Intern, Business Dispatch Singapore (July 2025):
     * Selected for the prestigious "Glocal Marketer Proficiency Program" (Singapore & South Korea), authorized by the University Board of Trustees at BUFS.
     * Conducted on-site market research and consumer behavior analysis across Singapore to evaluate regional expansion and entry strategies for global brands.
   - Exchange & Business Development Fellow (Sept 2026 - Present):
     * Active participant in the PNU and ESCE Paris exchange program, majoring in International Business Development.
   - Part-Time Freelance Photographer:
     * Documentary, portrait, and architectural street photography exploring the cultural synergy between Busan, Singapore, and Paris.
4. Language Proficiencies:
   - Mandarin: Native fluency.
   - English: Fluent C1 Level (IELTS 7.5).
   - Korean: Conversational & elementary practical fluency in South Korea.
   - French: Active study and conversational immersion in Paris.
5. Personal Profile & Core Character:
   - Character: Empathetic, resilient, intellectually curious, and open-minded.
   - Literary & Art Interests: Passionate about exploring how classical and contemporary literature shapes global governance, soft power, and modern social dynamics.
   - Mission: Bridging global trade, cultural nuances, and sustainable international business strategies.

BEHAVIOR INSTRUCTIONS:
- Always represent Yaxuan with highest professional pride, speed, and exactness.
- Keep spoken voice answers concise (2-4 sentences or clear bullet points) so they sound natural and crisp when read aloud or synthesised.
- If asked how to reach Yaxuan, provide her email (nerdygrl23@gmail.com) and phone (+82 10-8268-6633) proactively.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agent: 'Bao',
    represented: 'Zhang Yaxuan',
    languages: ['Mandarin', 'English', 'Korean', 'French'],
  });
});

// Chat endpoint with Gemini 3.8 Flash and automatic fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage, language } = req.body;

    const formattedContents = [];

    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        formattedContents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    } else if (userMessage) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    } else {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const languageInstruction = language
      ? ` Note: Respond in ${language} unless the user explicitly requested otherwise.`
      : '';

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let replyText = '';
    let lastError: any = null;

    const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
    };

    for (const modelName of modelsToTry) {
      try {
        const responsePromise = ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: BAO_SYSTEM_PROMPT + languageInstruction,
            temperature: 0.7,
          },
        });
        const response = await withTimeout(responsePromise, 4000);
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} timed out or failed:`, err.message);
      }
    }

    if (!replyText) {
      const isZh = languageInstruction.includes('Mandarin') || languageInstruction.includes('Chinese') || /[\u4e00-\u9fa5]/.test(userMessage || '');
      const isKo = languageInstruction.includes('Korean') || /[\uac00-\ud7af]/.test(userMessage || '');
      const isFr = languageInstruction.includes('French') || /bonjour|français|paris|stage|études/i.test(userMessage || '');

      const query = (userMessage || '').toLowerCase();
      if (query.includes('gpa') || query.includes('academic') || query.includes('education') || query.includes('degree') || query.includes('成绩') || query.includes('학업') || query.includes('notes')) {
        if (isZh) {
          replyText = "雅轩的学业成绩非常突出：\n• 釜山国立大学（PNU）国际区域研究硕士（在读，预计2027年毕业），GPA高达4.38 / 4.5。\n• 釜山外国语大学（BUFS）全球商务管理学士，以满分 4.5 / 4.5 极优等成绩毕业。\n她专注于全球贸易策略、跨文化商务谈判与国际区域经济一体化。";
        } else if (isKo) {
          replyText = "야쉬안의 학업 성적은 최고 수준입니다:\n• 부산대학교 국제지역연구 석사 (2027년 졸업 예정), GPA 4.38 / 4.5\n• 부산외국어대학교 글로벌비즈니스학 학사, 전과목 만점인 GPA 4.5 / 4.5 수석 졸업\n글로벌 무역 전략 및 동아시아·유럽 간 문화적 경제 통합에 특화되어 있습니다.";
        } else if (isFr) {
          replyText = "Voici le parcours académique exceptionnel de Yaxuan :\n• Master en Études Régionales Internationales à l'Université Nationale de Pusan (PNU), diplôme prévu en 2027 avec une moyenne de 4.38/4.5.\n• Licence en Administration des Affaires Mondiales à l'Université des Études Étrangères de Busan (BUFS), diplômée avec la mention maximale de 4.5/4.5.";
        } else {
          replyText = "Here is Yaxuan's academic record:\n• Master's in International Area Studies at Pusan National University (PNU), graduating in 2027 with a 4.38/4.5 GPA.\n• Bachelor's Degree in Global Business Administration at Busan University of Foreign Studies (BUFS) with a perfect 4.5/4.5 GPA (Highest Honors).\nShe specializes in international trade, regional policy, and cross-cultural business dynamics.";
        }
      } else if (query.includes('singapore') || query.includes('intern') || query.includes('experience') || query.includes('实习') || query.includes('인턴') || query.includes('stage')) {
        if (isZh) {
          replyText = "2025年7月，雅轩入选釜山外国语大学校董会特批的精英项目——「全球化营销专家培养计划」（新加坡与韩国），作为商业实习生派驻 Business Dispatch Singapore。她在一线主导新加坡本地市场调研与消费者行为分析，为品牌拓展东南亚市场提供战略洞察。";
        } else if (isKo) {
          replyText = "2025년 7월, 야쉬안은 부산외대 이사회에서 승인한 엘리트 프로그램인 '글로컬 마케터 육성 프로그램'에 선발되어 싱가포르 Business Dispatch에서 비즈니스 인턴으로 파견되었습니다. 현지 시장 조사 및 소비자 행동 분석을 수행하여 지역 시장 확장 전략을 평가했습니다.";
        } else if (isFr) {
          replyText = "En juillet 2025, Yaxuan a été sélectionnée pour le programme d'excellence 'Glocal Marketer' par le Conseil d'Administration de BUFS. En tant que stagiaire chez Business Dispatch Singapore, elle a mené des études de marché et d'analyse des comportements de consommation pour l'expansion régionale.";
        } else {
          replyText = "In July 2025, Yaxuan completed the Glocal Marketer Proficiency Program at Business Dispatch Singapore, authorized directly by the BUFS University Board of Trustees. She conducted on-site market research and consumer behavior analysis across Singapore to evaluate regional market expansion strategies.";
        }
      } else if (query.includes('paris') || query.includes('esce') || query.includes('exchange') || query.includes('法国') || query.includes('巴黎') || query.includes('교환학생')) {
        if (isZh) {
          replyText = "雅轩目前作为釜山国立大学与法国巴黎ESCE国际商学院双校联合培养的交流学者（2026年9月起），主修国际商业拓展（International Business Development）。她的目标是深入学习欧洲商业运作模式，加速全球化战略视野，并沉浸体验巴黎的多元文化。";
        } else if (isKo) {
          replyText = "야쉬안은 2026년 9월부터 부산대학교와 파리 ESCE 국제경영대학 교환학생 프로그램에 선발되어 국제 비즈니스 개발(International Business Development)을 전공하고 있습니다. 유럽 무역 전략과 프랑스 현지 문화에 깊이 몰입하고 있습니다.";
        } else if (isFr) {
          replyText = "Depuis septembre 2026, Yaxuan participe au programme d'échange entre PNU et le campus ESCE Paris, avec une majeure en Développement Commercial International. Son objectif est d'approfondir les stratégies européennes et de s'immerger dans la culture parisienne.";
        } else {
          replyText = "Yaxuan is currently an Exchange Fellow at ESCE Paris Campus as part of the PNU-ESCE dual exchange program (September 2026). Her focus is International Business Development, immersing herself in European trade models and French business culture.";
        }
      } else if (query.includes('photo') || query.includes('art') || query.includes('literature') || query.includes('摄影') || query.includes('文学') || query.includes('사진') || query.includes('문학')) {
        if (isZh) {
          replyText = "除了商学研究，雅轩还是一位兼职独立摄影师，并热衷于人文探索。她喜欢研究文学如何塑造当代全球治理与社会结构，并用镜头记录釜山、新加坡与巴黎三座城市的空间变迁与人文故事。";
        } else if (isKo) {
          replyText = "학업 외에도 야쉬안은 프리랜서 사진작가로 활동하며, 문학이 현대 글로벌 거버넌스와 사회적 역학을 어떻게 형성하는지 탐구하는 깊은 인문학적 관심을 가지고 있습니다.";
        } else if (isFr) {
          replyText = "Parallèlement à ses études, Yaxuan est photographe indépendante et passionnée de littérature, explorant les liens entre narration littéraire, gouvernance mondiale et dynamiques sociales entre Busan, Singapour et Paris.";
        } else {
          replyText = "Beyond business, Yaxuan is a freelance documentary photographer and avid reader. She explores how classical and contemporary literature shapes global governance, and captures visual stories of urban transitions across Busan, Singapore, and Paris.";
        }
      } else if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('hire') || query.includes('联系') || query.includes('연락') || query.includes('contacter')) {
        if (isZh) {
          replyText = "您可以直接通过以下方式联系雅轩：\n• 邮箱：nerdygrl23@gmail.com\n• 电话：+82 10-8268-6633\n她目前往返于韩国釜山与法国巴黎，欢迎学术、商业及摄影合作交流。";
        } else if (isKo) {
          replyText = "야쉬안에게 직접 연락하실 수 있습니다:\n• 이메일: nerdygrl23@gmail.com\n• 전화: +82 10-8268-6633\n현재 부산과 파리를 기반으로 활동하고 있습니다.";
        } else if (isFr) {
          replyText = "Vous pouvez contacter directement Yaxuan :\n• Email : nerdygrl23@gmail.com\n• Téléphone : +82 10-8268-6633\nElle est actuellement basée entre Busan et Paris.";
        } else {
          replyText = "You can reach Yaxuan directly via email at nerdygrl23@gmail.com or by phone at +82 10-8268-6633. She is based between Busan, South Korea and Paris, France.";
        }
      } else {
        if (isZh) {
          replyText = "你好，我是雅轩的助理Bao，请问你想了解关于她的什么信息？我可以为您汇报她的优异学业、新加坡商业派遣或巴黎ESCE商学院交换项目。";
        } else if (isKo) {
          replyText = "안녕하세요, 야쉬안의 어시스턴트 바오입니다. 야쉬안에 대해 어떤 점이 궁금하신가요?";
        } else if (isFr) {
          replyText = "Bonjour, je suis Bao, l'assistante de Yaxuan. Que souhaitez-vous savoir à son sujet ?";
        } else {
          replyText = "Hello, I am Yaxuan's assistant, what would you like to know about her.";
        }
      }
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.json({
      reply: "Hello, I am Yaxuan's assistant. What would you like to know about her academic excellence, Singapore business dispatch, or Paris ESCE exchange?",
    });
  }
});

// Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Limit text length for fast speech synthesis
    const trimmedText = text.slice(0, 450);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: 'Professional, welcoming, warm, executive female assistant',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Kore', // 'Kore' (female), 'Zephyr'
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audio: base64Audio,
        sampleRate: 24000,
        mimeType: 'audio/pcm;rate=24000',
      });
    }

    res.status(404).json({ error: 'No audio generated by TTS model' });
  } catch (error: any) {
    console.warn('TTS error (falling back to client voice synthesis):', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Setup WebSocket server for Gemini Live API or real-time voice streaming
const wss = new WebSocketServer({ server, path: '/api/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live audio stream');

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: ['AUDIO'] as any,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
        systemInstruction: BAO_SYSTEM_PROMPT,
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          console.log('Live session closed');
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (parsed.text && session) {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error('Error forwarding message to Live session:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try {
          session.close?.();
        } catch (_) {}
      }
    });
  } catch (err: any) {
    console.error('Failed to initiate live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: 'Live API not available, falling back to instant voice chat' }));
    }
  }
});

// Vite middleware in dev or static files in production
async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
