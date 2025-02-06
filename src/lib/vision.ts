import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export interface ImageAnalysis {
  title: string;
  description: string;
}

export async function analyzeImage(imageFile: File): Promise<ImageAnalysis> {
  try {
    // Convert the file to base64
    const base64Image = await fileToBase64(imageFile);

    // Create the completion request
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide a concise title and brief description (max 150 characters) that would be suitable for an AR activation. Focus on key visual elements. Format the response as 'Title: [title]\nDescription: [description]'"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No analysis generated');

    // Parse the response to extract title and description
    const titleMatch = content.match(/Title:(.+?)(?=Description:|$)/s);
    const descriptionMatch = content.match(/Description:(.+)$/s);

    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Activation';
    let description = descriptionMatch ? descriptionMatch[1].trim() : '';
    
    // Ensure description is no longer than 150 characters
    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }

    return { title, description };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
}