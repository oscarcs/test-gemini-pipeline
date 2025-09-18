import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import { getAPIKeys } from "./apiKeyManager";

/**
 * Generates a watercolour painting from a satellite image.
 * @param imageDataUrl A data URL string of the source image (e.g., 'data:image/png;base64,...').
 * @returns A promise that resolves to a base64-encoded image data URL of the generated painting.
 */
export async function generateWatercolourPainting(imageDataUrl: string): Promise<string> {
  // Get API keys dynamically
  const apiKeys = getAPIKeys();
  if (!apiKeys) {
    throw new Error("Gemini API key is not available. Please configure your API keys.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKeys.geminiApiKey });

  const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format. Expected 'data:image/...;base64,...'");
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const prompt = `Create a traditional watercolor painting of an isometric perspective of this building. Only render the targetted building, don't render any shadows or paper background.`;
  
  const textPart = {
    text: prompt,
  };

  const maxRetries = 3;
  const initialDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });
      
      const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

      if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        console.log(`Received image data (${mimeType}), length:`, data.length);
        return `data:${mimeType};base64,${data}`;
      }

      const textResponse = response.text;
      console.error("API did not return an image. Response:", textResponse);
      throw new Error(`The AI model responded with text instead of an image: "${textResponse || 'No text response received.'}"`);

    } catch (error) {
      console.error(`Error generating image from Gemini API (Attempt ${attempt}/${maxRetries}):`, error);
      
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      const isInternalError = errorMessage.includes('"code":500') || errorMessage.includes('INTERNAL');

      if (isInternalError && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Internal error detected. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue; // Go to the next iteration of the loop
      }

      if (error instanceof Error) {
          throw new Error(`The AI model failed to generate an image after ${attempt} attempts. Details: ${error.message}`);
      }
      throw new Error(`The AI model failed to generate an image after ${attempt} attempts. Please check the console for more details.`);
    }
  }

  // This part should be unreachable if the loop logic is correct, but it's good practice for type safety.
  throw new Error("The AI model failed to generate an image after all retries.");
}