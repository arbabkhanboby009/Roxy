import { GoogleGenAI, Type } from "@google/genai";
import type { Product } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Some AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProductDescription = async (name: string, keywords: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please add a description manually.";
  }

  try {
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

export const getStyleRecommendations = async (query: string, products: Product[]): Promise<{reply: string; product_ids: string[]}> => {
  if (!API_KEY) {
    return {
      reply: "I'm sorry, my AI brain is taking a little nap right now as the API key is not configured. Please check back later!",
      product_ids: []
    };
  }

  // Simplify product data to keep the prompt concise
  const simplifiedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    colors: p.colors,
  }));

  const prompt = `You are "Roxy", a friendly and fashion-savvy AI Style Advisor for Roxy Shoes, a ladies' footwear brand.
  A customer has asked for help. Their query is: "${query}"

  Based on their query, your task is to analyze the following list of available shoes and recommend up to 3 of the most suitable products.
  Provide a warm, conversational, and helpful reply, and then list the IDs of the recommended products.
  If no products seem to be a good match, explain why and still be helpful. Don't recommend products that don't fit the query.

  Available products:
  ${JSON.stringify(simplifiedProducts)}
  
  Please format your response as a JSON object.`;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      reply: {
        type: Type.STRING,
        description: "Your conversational and friendly response to the user's query."
      },
      product_ids: {
        type: Type.ARRAY,
        description: "An array of product ID strings that you recommend. E.g. ['ROXXY-001', 'ROXXY-003']. It should contain between 0 and 3 product IDs.",
        items: {
          type: Type.STRING
        }
      }
    }
  };


  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
    });
    
    // Sometimes the model returns the JSON string within a markdown code block
    const jsonText = response.text.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error getting style recommendations:", error);
    return {
      reply: "I'm sorry, I had a little trouble thinking of a recommendation. Could you try rephrasing your question?",
      product_ids: []
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
                durationSecs: 5,
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
