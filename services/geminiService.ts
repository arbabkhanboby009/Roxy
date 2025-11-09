import { GoogleGenAI, Type } from "@google/genai";
import type { Product } from '../types';

export const generateProductDescription = async (name: string, keywords: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key not found. Some AI features will be disabled.");
    return "API Key not configured. Please add a description manually.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a compelling, modern, and elegant product description for a ladies' shoe for the brand "Roxy Shoes".
    The product is named "${name}".
    Key features or keywords: "${keywords}".
    The description should be concise (around 50-80 words), appealing to a fashion-conscious audience, and highlight style and comfort. Do not use markdown or special formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again or write one manually.";
  }
};

// FIX: Add getStyleRecommendations function to provide AI-based style advice.
export const getStyleRecommendations = async (query: string, products: Product[]): Promise<{ reply: string; product_ids: string[] }> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("Gemini API key not found. Some AI features will be disabled.");
        return {
            reply: "I'm sorry, the AI Style Advisor is currently unavailable. Please try again later.",
            product_ids: [],
        };
    }

    // Simplify product data for the prompt to save tokens and improve relevance
    const simplifiedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        subcategory: p.subcategory,
        colors: p.colors,
    }));

    const prompt = `You are an AI style advisor for a shoe store called "Roxy Shoes". A customer is asking for recommendations.
    Based on their query and the available products, provide a friendly and helpful reply and a list of up to 3 relevant product IDs.
    If no products match, say so in a friendly way and do not return any product IDs.

    Customer query: "${query}"

    Available products (JSON format):
    ${JSON.stringify(simplifiedProducts)}

    Your response must be in JSON format matching the provided schema.`;
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reply: {
                            type: Type.STRING,
                            description: "A friendly and helpful response to the user's query, explaining the recommendations.",
                        },
                        product_ids: {
                            type: Type.ARRAY,
                            description: "An array of product IDs that best match the user's query. Return up to 3 relevant product IDs. If no products are relevant, return an empty array.",
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                    required: ["reply", "product_ids"],
                },
            },
        });

        const responseText = response.text.trim();
        const result = JSON.parse(responseText);
        
        // Basic validation of the parsed result
        if (result && typeof result.reply === 'string' && Array.isArray(result.product_ids)) {
            return result;
        } else {
            throw new Error("Invalid JSON response format from AI.");
        }

    } catch (error) {
        console.error("Error getting style recommendations:", error);
        return {
            reply: "I'm having a little trouble finding the perfect match right now. Could you try rephrasing your request?",
            product_ids: [],
        };
    }
};

export const generateVideoAd = async (prompt: string, imageBase64: string, imageMimeType: string): Promise<string> => {
    // Re-instantiate to get latest API key from the selection dialog
    const currentApiKey = process.env.API_KEY;
    if (!currentApiKey) {
        throw new Error("API Key is not configured. Please select an API key.");
    }

    try {
        const videoAI = new GoogleGenAI({ apiKey: currentApiKey });
        let operation = await videoAI.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: imageMimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16', // Good for social media stories/reels
                // FIX: Removed invalid 'durationSecs' parameter as it is not supported by the Veo API.
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await videoAI.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }
        
        // The URL needs the API key to be fetched
        return `${downloadLink}&key=${currentApiKey}`;
    } catch (error) {
        console.error("Error generating video ad:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
             throw new Error("Your API Key seems invalid or lacks permissions for the Veo model. Please re-select your API key and try again.");
        }
        throw new Error("Failed to generate video. The model may be unavailable or the request could not be processed. Please try again later.");
    }
};