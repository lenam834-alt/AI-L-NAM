import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { ImageAsset } from "../types";

const getAIClient = (forceNew: boolean = false) => {
  // If we need to force a new client (e.g. after key selection), we can manage that logic here
  // But strictly per instructions, we create a new instance right before API calls if handling key selection.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Text Generation ---

export const generateMarketingText = async (prompt: string, systemInstruction: string = "You are a marketing expert.") => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateJSON = async (prompt: string, schema: Schema, systemInstruction: string = "You are a helpful assistant.") => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Gemini JSON Error:", error);
    throw error;
  }
};

// --- Image Generation ---

export const generateIllustration = async (prompt: string, textOverlay?: string, referenceImage?: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    // If text overlay is requested, we use the Pro model which handles text-in-image better
    // Otherwise we use Banana (flash-image) for speed and illustration style
    const model = textOverlay || referenceImage ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const parts: any[] = [];

    if (referenceImage) {
        const base64Data = referenceImage.split(',')[1];
        // Guess mime type or default to png, API is flexible with mime if data is correct
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: 'image/png' 
            }
        });
    }

    let finalPrompt = prompt;
    if (referenceImage) {
        finalPrompt = `${prompt}. The image provided is the main product. Feature this product clearly in the illustration.`;
    }
    if (textOverlay) {
        finalPrompt = `${finalPrompt}. Important: Embed the text "${textOverlay}" artistically into the image. Ensure spelling is correct. Include 3D illustrative icons relevant to the text.`;
    }

    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Illustration Gen Error:", error);
    throw error;
  }
};

export const generateProductAdImage = async (productName: string, setting: string, style: string, inputImage?: ImageAsset): Promise<string | null> => {
  const ai = getAIClient();
  try {
    // Using 'gemini-2.5-flash-image' (Google Banana) for Product Ads
    const parts: any[] = [];

    if (inputImage) {
         parts.push({
            inlineData: {
                data: inputImage.base64.split(',')[1],
                mimeType: inputImage.mimeType
            }
        });
    }

    const prompt = `Professional product photography advertisement for "${productName}". 
    Setting/Background: ${setting}. 
    Style/Lighting: ${style}. 
    High quality, 4k, photorealistic, commercial advertising standard.
    ${inputImage ? 'Use the provided product image as the main subject.' : ''}`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: {
        // imageConfig is not fully supported on Flash Image for all params, but we rely on prompt
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Product Ad Gen Error:", error);
    throw error;
  }
};

export const generateImageWithText = async (text: string, fontStyle: string, textStyle: string, inputImage: ImageAsset): Promise<string | null> => {
  const ai = getAIClient();
  try {
    // We use gemini-3-pro-image-preview for text rendering tasks as it has superior OCR and text generation capabilities
    const parts: any[] = [];

    parts.push({
        inlineData: {
            data: inputImage.base64.split(',')[1],
            mimeType: inputImage.mimeType
        }
    });

    const prompt = `Edit this image. Add the text "${text}" to the image. 
    Crucial Requirement: Place a small, high-quality illustrative icon immediately next to or above/below the text that represents the meaning of "${text}".
    Font Appearance: ${fontStyle} (Must support Vietnamese characters if applicable).
    Text Effect/Style: ${textStyle}.
    Ensure the text is legible, correctly spelled, and aesthetically integrated into the composition.`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Text Gen Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, referenceImages: string[] = []): Promise<string | null> => {
  const ai = getAIClient();
  try {
    // Instructions: Use 'gemini-2.5-flash-image' for General Image Generation
    // Or 'gemini-3-pro-image-preview' for High Quality. We'll use 3-pro for better fashion results.
    
    const parts: any[] = [];

    // Add reference images if provided
    referenceImages.forEach((img) => {
        const base64Data = img.split(',')[1]; // Assume data URI
        const match = img.match(/^data:(.+);base64,/);
        const mimeType = match ? match[1] : 'image/png';
        
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
    });

    // Add text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Fashion usually looks better in portrait
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const generateFashionImage = async (prompt: string, inputImages: ImageAsset[]) => {
  const refImages = inputImages.map(img => img.base64);
  return generateImage(prompt, refImages);
};

export const suggestPrompt = async (context: string) => {
  return generateMarketingText(`Suggest a detailed, professional photography prompt for AI image generation. 
  Context: ${context}. 
  Output only the prompt text in Vietnamese, describing lighting, pose, and atmosphere.`);
};

export const generateVeoPromptFromImage = async (image: ImageAsset) => {
  const ai = getAIClient();
  const prompt = "Describe this image in detail to be used as a prompt for video generation. Focus on movement, camera angle, and atmosphere. Output English text.";
  
  const parts = [
      { text: prompt },
      { inlineData: { mimeType: image.mimeType, data: image.base64.split(',')[1] } }
  ];
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts }
    });
    return response.text || "";
  } catch (error) {
    console.error("Veo Prompt Error:", error);
    throw error;
  }
};

// --- Video Generation (Veo) ---

export const ensureApiKeySelected = async () => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
};

export const generateVeoVideo = async (imageBase64: string, prompt: string) => {
  // CRITICAL: Create new instance after key selection potentially happened
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract base64 data from data URI
  const base64Data = imageBase64.split(',')[1];

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Data,
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Portrait for social media
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
      const uri = operation.response.generatedVideos[0].video.uri;
      return `${uri}&key=${process.env.API_KEY}`;
    }
    return null;

  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
        // Reset key selection flow
        if (window.aistudio && window.aistudio.openSelectKey) {
             await window.aistudio.openSelectKey();
             throw new Error("API Key invalid or project not found. Please re-select key.");
        }
    }
    console.error("Veo Error:", error);
    throw error;
  }
};