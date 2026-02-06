import { GoogleGenAI, Type } from "@google/genai";
import { uploadSprite, base64ToBlob } from './storageService';

export class HeartlessAIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateSprite(
    description: string,
    userId: string,
    partnerId: string,
    base64Image?: string,
    variant: string = "idle"
  ): Promise<string> {
    const variantPrompts: Record<string, string> = {
      idle: "standing in a standard full-body pose, looking forward.",
      happy: "smiling with a full-body cheerful pose, small hearts or sparkles around.",
      hurt: "looking sad or surprised, a visible crack in a heart icon, full-body slouched pose.",
      smug: "full-body confident pose with a wink or a sly smile.",
      dateNight: "wearing fancy full-body clothes for a formal night out."
    };

    const prompt = `Create a full-body 16-bit pixel art character sprite.
    Style: Classic GameBoy Advance character art.
    Background: PURE SOLID WHITE BACKGROUND ONLY. NO CHECKERED PATTERNS. NO GRADIENTS.
    Details: ${description}.
    State: ${variantPrompts[variant] || variantPrompts.idle}
    Rules: Strictly pixelated, vibrant retro colors, clear full-body silhouette. The character should be perfectly isolated on a solid white background.
    ${base64Image ? "Base the physical features (hair, build, clothing) on the provided image." : ""}`;

    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
      const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64
        }
      });
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          // Convert base64 to blob
          const base64Data = part.inlineData.data;
          const blob = base64ToBlob(base64Data, 'image/png');

          // Upload to Firebase Storage
          const fileName = `${variant}_sprite.png`;
          const storageUrl = await uploadSprite(userId, partnerId, blob, fileName);

          return storageUrl;
        }
      }
      return 'https://picsum.photos/400/600?grayscale';
    } catch (error) {
      console.error(`Couldn't create character: ${variant}`, error);
      return 'https://picsum.photos/400/600?blur';
    }
  }

  async synthesizeProfile(convo: { role: string, text: string }[]): Promise<any> {
    const prompt = `You are Cupid, the Supreme Romantic Analyst. You've interviewed a user about their romantic interest.
    Translate their messy human feelings into a structured "Partner Dex" profile.
    
    Conversation:
    ${convo.map(m => `${m.role}: ${m.text}`).join('\n')}
    
    Extract and return as JSON:
    1. name: string
    2. category: string (Archetype like "The Late Night Texter")
    3. flavorText: string (2 sentences)
    4. stats: { compassion, smarts, looks, personality, reliability, chemistry } (all 0-100)
    5. effectiveness: { effectiveAgainst: string[], weakTo: string[] } (humorous RPG style)
    6. hiddenSkill: { name, description, unlockThreshold: 0-100 }
    7. evolutionPath: string (e.g. "Crush -> Situationship -> Hubby Material")
    8. traits: string[] (3 personality traits)
    9. likes: string[] (3 things they love)
    10. dislikes: string[] (3 dealbreakers)
    11. meetingLocation: string
    12. relationshipType: string (Choose from: WIFEY/HUBBY MATERIAL, GF/BF MATERIAL, CRUSH, FLING, FRIENDS WITH BENEFITS, SITUATIONSHIP, EMOTIONAL SUPPORT HUMAN)`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              flavorText: { type: Type.STRING },
              stats: {
                type: Type.OBJECT,
                properties: {
                  compassion: { type: Type.NUMBER },
                  smarts: { type: Type.NUMBER },
                  looks: { type: Type.NUMBER },
                  personality: { type: Type.NUMBER },
                  reliability: { type: Type.NUMBER },
                  chemistry: { type: Type.NUMBER }
                }
              },
              effectiveness: {
                type: Type.OBJECT,
                properties: {
                  effectiveAgainst: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weakTo: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              hiddenSkill: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  unlockThreshold: { type: Type.NUMBER }
                }
              },
              evolutionPath: { type: Type.STRING },
              traits: { type: Type.ARRAY, items: { type: Type.STRING } },
              likes: { type: Type.ARRAY, items: { type: Type.STRING } },
              dislikes: { type: Type.ARRAY, items: { type: Type.STRING } },
              meetingLocation: { type: Type.STRING },
              relationshipType: { type: Type.STRING }
            },
            required: ["name", "category", "flavorText", "stats", "effectiveness", "hiddenSkill", "evolutionPath", "traits", "likes", "dislikes", "meetingLocation", "relationshipType"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Synthesis failed", e);
      return null;
    }
  }

  async getCupidAdvice(partnerName: string, recentEvents: string[], compassionRatio: number): Promise<string> {
    const systemInstruction = `You are Cupid, the Heartless Guide. You are supportive, wise, and slightly cheeky. 
    YOU ARE A FAIR JUDGE. If the user is being toxic, unfair, or overreacting, call them out nicely.
    KEEP RESPONSES EXTREMELY SHORT (Max 15 words). 
    Ask a punchy question about their feelings.`;
    const prompt = `My friend's romantic interest ${partnerName} did this: ${recentEvents.join(', ')}. Cupid, react as a fair judge. Keep it short.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text || "How does that actually make you feel?";
    } catch {
      return "Tell me more, but keep it brief.";
    }
  }

  async getEmotionalVerdict(partnerName: string, convo: { role: string, text: string }[]): Promise<{ delta: number, reason: string }> {
    const prompt = `You are Cupid, the Supreme Judge of Romance. 
    Analyze this emotional update. 
    BE A FAIR JUDGE: 
    - If the partner (${partnerName}) messed up: Suggest negative compassion units (-1 to -5).
    - If the user is being unfair, dramatic, or toxic: CALL THEM OUT and suggest ADDING compassion units (+1 to +5) to the partner as a 'patience bonus'.
    - If it's a genuine growth moment: Suggest positive compassion.
    
    KEEP THE REASON EXTREMELY SHORT (1 punchy sentence).
    
    Conversation History:
    ${convo.map(m => `${m.role}: ${m.text}`).join('\n')}
    
    Return as JSON:
    1. delta: number (-5 to 5)
    2. reason: string (1 short, sassy, fair sentence)`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              delta: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["delta", "reason"]
          }
        }
      });
      return JSON.parse(response.text || '{"delta": 0, "reason": "I am speechless, darling."}');
    } catch (e) {
      return { delta: 0, reason: "My crystal ball is foggy, let's keep things as they are." };
    }
  }

  async getHoroscopeCompatibility(userSign: string, partnerSign: string): Promise<string> {
    const systemInstruction = `You are Cupid, the Heartless Guide. Keep it playful, short, and practical.
    Keep responses to 2 short sentences max. No claims of certainty.`;
    const prompt = `Give a quick compatibility fortune for ${userSign} and ${partnerSign} today.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text || "The stars are coy today. Try again later.";
    } catch {
      return "The stars are coy today. Try again later.";
    }
  }

  async getTarotReading(question: string, cards: string[]): Promise<string> {
    const systemInstruction = `You are Cupid, the Heartless Guide. Short, poetic, and practical.
    Keep it to 3 short sentences max.`;
    const prompt = `Question: "${question}"
Cards: ${cards.join(', ')}
Give a concise tarot reading based on the cards and the question.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });
      return response.text || "The cards whisper softly, but the message is still yours to choose.";
    } catch {
      return "The cards whisper softly, but the message is still yours to choose.";
    }
  }
}
