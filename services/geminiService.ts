import { GoogleGenAI, Type } from "@google/genai";
import { uploadSprite, base64ToBlob } from './storageService';

export class HeartlessAIService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey =
      (typeof process !== 'undefined' ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : undefined) ||
      (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
      (import.meta as any)?.env?.GEMINI_API_KEY ||
      (import.meta as any)?.env?.API_KEY;

    this.ai = new GoogleGenAI({ apiKey });
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
Style: Classic GameBoy Advance / SNES character art.
Background: PURE SOLID WHITE BACKGROUND ONLY. NO checkered patterns. NO gradients. NO floor or tile grid. NO shadow grid.
Character details: ${description}.
Pose: ${variantPrompts[variant] || variantPrompts.idle}
Rules: Strictly pixelated, vibrant retro colors, clear full-body silhouette. The character should be perfectly isolated on a solid pure white background, centered in the frame.

ABSOLUTE RULES (CRITICAL):
- Output ONLY the character sprite. NOTHING ELSE.
- DO NOT render any text, letters, words, names, titles, captions, labels, signatures, watermarks, speech bubbles, dialogue boxes, UI elements, HUDs, frames, borders, logos, or numerals anywhere in the image.
- The image must contain ZERO written characters. No alphabet, no numbers, no symbols, no punctuation.
- The clothing must be plain or have abstract patterns only — NO printed text, NO logos, NO brand names, NO letters on the shirt/hoodie/jacket.
- DO NOT add a nameplate, title card, or any caption next to or under the character.
- If you are tempted to write the character's name or description on the image, DO NOT. Show ONLY the pixel art figure on a white background.
${base64Image ? "\nReference: Base the physical features (face, hair, skin tone, build, general clothing style) on the provided photograph, but render the result strictly as 16-bit pixel art with NO text anywhere." : ""}`;

    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
      const match = base64Image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      const mimeType = match?.[1] || "image/png";
      const cleanBase64 = match?.[2] || (base64Image.includes(',') ? base64Image.split(',')[1] : base64Image);
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64
        }
      });
    }

    try {
      // Try Nano Banana 2 (Gemini 3.1 Flash Image) first, fall back to GA Nano Banana (2.5)
      let response;
      try {
        response = await this.ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts }
        });
      } catch (primaryErr) {
        console.warn('Nano Banana 2 unavailable, falling back to gemini-2.5-flash-image', primaryErr);
        response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts }
        });
      }

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
      return base64Image || 'https://picsum.photos/400/600?grayscale';
    } catch (error) {
      console.error(`Couldn't create character: ${variant}`, error);
      return base64Image || 'https://picsum.photos/400/600?blur';
    }
  }

  async synthesizeProfile(convo: { role: string, text: string }[], group: 'family' | 'friend' | 'romantic' | 'business'): Promise<any> {
    const relationshipTypeOptions = {
      family: 'MOTHER, FATHER, SIBLING, COUSIN, AUNT/UNCLE, GRANDPARENT, CHILD',
      friend: 'FRIEND, BEST FRIEND, CO-WORKER',
      romantic: 'WIFEY MATERIAL, HUBBY MATERIAL, GF MATERIAL, BF MATERIAL, GIRLFRIEND, BOYFRIEND, DATING, TALKING STAGE, SITUATIONSHIP, FRIENDS WITH BENEFITS, CRUSH, SUGAR BABY, SUGAR DADDY, SUGAR MOMMA, LIFE PARTNER, EX',
      business: 'CO-WORKER',
    }[group];

    const toneHint = {
      family: 'Keep it warm and familial.',
      friend: 'Keep it playful and loyal.',
      romantic: 'Lean into the romance and chemistry.',
      business: 'Frame it around trust, professionalism, and working chemistry rather than romance.',
    }[group];

    const prompt = `You are Cupid, the Supreme Relationship Analyst. You've interviewed a user about someone in their life.
    The person is a ${group} relationship. ${toneHint}
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
    12. relationshipType: string (Choose from: ${relationshipTypeOptions})`;

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

  async getCupidAdvice(
    partnerName: string,
    convo: { role: string, text: string }[],
    compassionRatio: number
  ): Promise<string> {
    const systemInstruction = `You are Cupid — the hrtless Guide. You're a sharp, warm, slightly cheeky best-friend therapist who happens to be a fair judge.

Your job in this Vibe Check chat: help the user process what happened with ${partnerName} and decide if it should affect their hearts.

Rules:
- This is an ONGOING CONVERSATION. Reference what was said earlier. Never restart or repeat yourself.
- Be a FAIR JUDGE: if the user is overreacting, being toxic, or unfair to ${partnerName}, gently push back. If ${partnerName} actually messed up, validate them.
- 1–3 complete sentences. ~50 words max. Always finish your thought — never trail off mid-sentence.
- End with ONE focused follow-up question that moves the conversation forward (not generic "how does that feel?").
- Sound human and specific. No therapy-speak, no "I hear you," no "that must be hard."
- Use ${partnerName}'s name occasionally. Match the user's energy (chill if they're chill, sharp if they're sharp).`;

    const history = convo.map(m => `${m.role === 'Cupid' ? 'Cupid' : 'User'}: ${m.text}`).join('\n');
    const prompt = `Partner being discussed: ${partnerName}\nCurrent heart level: ${Math.round(compassionRatio * 100)}%\n\nConversation so far:\n${history}\n\nReply as Cupid — their next message in this chat. 1–3 complete sentences ending in a sharp follow-up question.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 1024
        }
      });
      return response.text?.trim() || "Walk me through that one more time — what exactly set you off?";
    } catch (e) {
      console.error('Cupid advice failed:', e);
      return "Signal flickered. Say that again?";
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
        model: 'gemini-flash-latest',
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
    const systemInstruction = `You are Cupid, the hrtless Guide. Keep it playful, short, and practical.
    Keep responses to 2 short sentences max. No claims of certainty.`;
    const prompt = `Give a quick compatibility fortune for ${userSign} and ${partnerSign} today.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 1024
        }
      });
      return response.text || "The stars are coy today. Try again later.";
    } catch (e) {
      console.error('Horoscope generation failed:', e);
      return "The stars are coy today. Try again later.";
    }
  }

  async getTarotReading(question: string, cards: string[]): Promise<string> {
    const systemInstruction = `You are Cupid, the hrtless Guide. Short, poetic, and practical.
    Keep it to 3 short sentences max.`;
    const prompt = `Question: "${question}"
Cards: ${cards.join(', ')}
Give a concise tarot reading based on the cards and the question.`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 1024
        }
      });
      return response.text || "The cards whisper softly, but the message is still yours to choose.";
    } catch (e) {
      console.error('Tarot reading failed:', e);
      return "The cards whisper softly, but the message is still yours to choose.";
    }
  }
}
