import { useToast } from "@/hooks/use-toast";

// Fetch the API key from Vite environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const TEXT_MODEL = "llama-3.3-70b-versatile";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export interface AIRequest {
  prompt: string;
  image?: File | null;
}

export interface ImageAnalysisRequest {
  image: File;
  prompt?: string;
}

export const generateGeminiResponse = async (request: AIRequest) => {
  return generateAIResponse(request);
};

export const analyzeImageWithGemini = async (request: ImageAnalysisRequest) => {
  return analyzeImageWithAI(request);
};

export const generateAIResponse = async (request: AIRequest) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    const messages: any[] = [];
    
    if (request.image) {
      const base64Image = await convertImageToBase64(request.image);
      messages.push({
        role: "user",
        content: [
          { type: "text", text: request.prompt || "Analyze this image." },
          { type: "image_url", image_url: { url: `data:${request.image.type};base64,${base64Image}` } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: request.prompt
      });
    }

    const body = {
      messages,
      model: request.image ? VISION_MODEL : TEXT_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response received";
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

export const analyzeImageWithAI = async (request: ImageAnalysisRequest) => {
  try {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    const base64Image = await convertImageToBase64(request.image);
    const analysisPrompt = request.prompt || 
      "Analyze this crop or farm image. Provide detailed insights about: " +
      "1. Crop health status\n" +
      "2. Potential diseases or pests if visible\n" +
      "3. Growth stage assessment\n" +
      "4. Soil condition observations\n" +
      "5. Recommendations for improvement";

    const body = {
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: analysisPrompt },
            { type: "image_url", image_url: { url: `data:${request.image.type};base64,${base64Image}` } }
          ]
        }
      ],
      model: VISION_MODEL,
      temperature: 0.4,
      max_tokens: 2048,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No analysis provided";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
