// src/lib/ai-provider.ts

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

export class BrandGenAI {
  private static BASE_PROMPT = "Premium hand-drawn branding illustration in Plus X style, slightly irregular human-like lines, soft muted pastel color palette, gentle light source from the upper left, subtle analog textures like watercolor or crayon, generous negative space for focus, minimalist corporate editorial aesthetic, high quality, professional artistic touch";

  /**
   * Enhances a user prompt using local Ollama (Exaone)
   */
  static async enhancePrompt(userPrompt: string): Promise<string> {
    try {
      console.log("Enhancing prompt with local Ollama (Exaone)...");
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "exaone3.5:7.8b",
          prompt: `[System]
You are a world-class branding design expert specializing in the "Plus X" illustration style. 
Your task is to translate and expand the user's input into a highly descriptive, artistic English prompt for image generation.

[Style Guidelines]
- Style: Hand-drawn, warm, empathetic, emotional.
- Lines: Slightly irregular, human-like (not clean vector).
- Lighting: Soft light from the upper left.
- Colors: Muted, pastel, soft (no high-contrast or neon).
- Composition: Simple, focus on metaphors/gestures, generous negative space.

[Task]
1. Translate the user's Korean input into English.
2. Add descriptive keywords that follow the Style Guidelines.
3. Output ONLY the final English prompt. No explanations.

[User Input]
${userPrompt}

[Output (English Prompt)]`,
          stream: false
        }),
      });

      const data = await response.json();
      const enhanced = data.response?.trim();
      console.log("Enhanced prompt:", enhanced);
      return enhanced || userPrompt;
    } catch (error) {
      console.error("Ollama enhancement failed, using original prompt:", error);
      return userPrompt;
    }
  }

  /**
   * Generates an image URL using Pollinations.ai (Free, no API key required)
   */
  static async generateImageUrl(options: ImageGenerationOptions): Promise<string> {
    const { prompt, width = 1024, height = 1024, seed = Math.floor(Math.random() * 1000000) } = options;
    
    // Clean the prompt
    const cleanPrompt = prompt.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    
    // Combine base prompt with user input
    const fullPrompt = `${this.BASE_PROMPT}, ${cleanPrompt}`;
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    // Construct Pollinations URL
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
    
    return url;
  }

  /**
   * Fetches the image as a buffer (useful for API routes)
   */
  static async generateImageBuffer(options: ImageGenerationOptions): Promise<Buffer> {
    const url = await this.generateImageUrl(options);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
