import { cacheDirectory, getInfoAsync, downloadAsync, readAsStringAsync } from 'expo-file-system/legacy';
import { AnalysisData, TutorialStep, SwapSuggestion, UpcycleIdea } from '../types';
import { GEMINI_ANALYSIS_PROMPT, GEMINI_TUTORIAL_PROMPT, getPollinationImageUrl } from './prompts';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const POLLINATION_API_KEY = process.env.EXPO_PUBLIC_POLLINATION_API_KEY || "";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeItemWithGemini = async (base64Image: string): Promise<AnalysisData> => {
    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: GEMINI_ANALYSIS_PROMPT },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const json = await response.json();
        const rawText = json.candidates[0].content.parts[0].text;
        
        let parsed: AnalysisData;
        try {
            parsed = JSON.parse(rawText);
        } catch (e) {
            // Strip markdown formatting if the model still wrapped it
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleaned);
        }

        return parsed;

    } catch (error) {
        console.error("Analysis Failed:", error);
        throw error;
    }
};

export const generateTutorialWithGemini = async (idea: UpcycleIdea): Promise<{ materials: string[], steps: TutorialStep[] }> => {
    try {
        const prompt = GEMINI_TUTORIAL_PROMPT.replace('{title}', idea.title).replace('{description}', idea.description);
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${await response.text()}`);
        }

        const json = await response.json();
        const rawText = json.candidates[0].content.parts[0].text;
        
        let parsed: { materials: string[], steps: TutorialStep[] };
        try {
            parsed = JSON.parse(rawText);
        } catch (e) {
            const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleaned);
        }

        return parsed;

    } catch (error) {
        console.error("Tutorial Generation Failed:", error);
        throw error;
    }
};

/**
 * Downloads a Pollinations AI image to local cache and returns the local file URI.
 * This ensures the image generates once and is stored permanently, and properly passes the auth headers.
 */
export const fetchAndCacheGeneratedImage = async (prompt: string, uniqueId: string, model: string = "flux"): Promise<string> => {
    if (!prompt) return "";
    
    try {
        const cacheUri = `${cacheDirectory}pollination_${uniqueId}.jpg`;
        const fileInfo = await getInfoAsync(cacheUri);
        
        if (fileInfo.exists) {
            return cacheUri;
        }

        const url = getPollinationImageUrl(prompt, Math.floor(Math.random() * 100000), model);
        
        const downloadRes = await downloadAsync(
            url,
            cacheUri,
            {
                headers: {
                    "Authorization": `Bearer ${POLLINATION_API_KEY}`
                }
            }
        );
        
        if (downloadRes.status !== 200) {
            console.error("Failed downloading pollinations image", downloadRes.status, await readAsStringAsync(downloadRes.uri));
            return "";
        }

        return downloadRes.uri;

    } catch (err) {
        console.error("Pollinations generation failed:", err);
        return "";
    }
};
