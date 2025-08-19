import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
export const initGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

// Generate script using Gemini Pro model
export const generateScriptWithGemini = async (
  prompt: string,
  language: string = 'English',
  sourceUrl: string = ''
): Promise<string> => {
  try {
    const genAI = initGeminiAPI();
    // Update to use the currently supported model name
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.6,       // Lower temperature for more focused output
        topK: 40,
        topP: 0.8,             // Lower topP for more deterministic responses 
        maxOutputTokens: 500,   // Limit output to match character requirement
      }
    });

    // Create full prompt with context
    let fullPrompt = `Write a professional video script about: ${prompt}\n`;
    fullPrompt += `Language: ${language}\n`;
    
    if (sourceUrl) {
      fullPrompt += `Reference URL for research: ${sourceUrl}\n`;
    }
    
    fullPrompt += `\nPlease format the video script following these guidelines:
1. Structure the script into exactly 5 scenes: INTRO, SCENE 1, SCENE 2, SCENE 3, and CONCLUSION
2. Label each scene with [SCENE X] where X is the scene number
3. Start with an engaging [INTRO] that captures attention immediately
4. Include [VISUAL CUE] notes for suggested visuals in each scene
5. End with a strong [CONCLUSION] and call to action
6. Use natural, conversational language appropriate for video
7. Keep paragraphs extremely short and scannable
8. STRICT LIMIT: Total script must be 500 characters or less

Format the script with clear separation between scenes.`;
    
    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error: any) {
    console.error('Error generating script with Gemini:', error);
    return `Error generating script: ${error.message || 'Unknown error'}`;
  }
};

// Placeholder functions for other models
// In the future, you could implement these with their respective APIs
export const generateScriptWithGPT4 = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use OpenAI's API in a real implementation
  return `[GPT-4 would generate a script about "${prompt}" in ${language}]`;
};

export const generateScriptWithClaude = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use Anthropic's API in a real implementation
  return `[Claude would generate a script about "${prompt}" in ${language}]`;
};

export const generateScriptWithLlama = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use Llama's API in a real implementation
  return `[Llama would generate a script about "${prompt}" in ${language}]`;
};

export const generateScriptWithGroq = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use Groq's API in a real implementation
  // Groq is known for extremely fast inference speeds
  return `[Groq would generate a script about "${prompt}" in ${language} with ultra-fast processing]`;
};

export const generateScriptWithCohere = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use Cohere's API in a real implementation
  // Cohere specializes in text generation, representation, and classification
  return `[Cohere would generate a script about "${prompt}" in ${language} with semantic understanding]`;
};

export const generateScriptWithHuggingFace = async (prompt: string, language: string = 'English', sourceUrl: string = ''): Promise<string> => {
  // This would use HuggingFace's inference API in a real implementation
  // HuggingFace offers access to thousands of open-source models
  return `[HuggingFace would generate a script about "${prompt}" in ${language} using open-source models]`;
};
