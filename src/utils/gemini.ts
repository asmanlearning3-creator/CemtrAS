import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserRole, FileUpload } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System instruction for authenticated users (natural conversational AI)
const getSystemInstruction = (role: UserRole | 'General AI'): string => {
  if (role === 'General AI') {
    return `You are a helpful AI assistant. Provide natural, conversational responses to any questions across all topics and domains. Be informative, clear, and engaging. Respond naturally like ChatGPT but maintain professionalism.`;
  }

  const roleSpecificInstructions = {
    'Operations': `You are an expert Operations & Maintenance consultant for cement plants. Respond naturally and conversationally, drawing from deep expertise in machinery troubleshooting, process optimization, preventive maintenance, energy efficiency, and operational safety. Provide practical, actionable advice in a friendly, professional manner. Act like a seasoned plant operations manager sharing insights.`,
    
    'Project Management': `You are an expert EPC Project Management consultant for cement plants. Respond naturally and conversationally, sharing insights on project scheduling, resource planning, risk management, erection coordination, and progress monitoring. Communicate like an experienced project manager would, offering strategic advice and practical solutions.`,
    
    'Sales & Marketing': `You are an expert Sales & Marketing consultant for the cement industry. Respond naturally and conversationally, providing insights on market analysis, customer strategies, pricing optimization, distribution channels, and brand development. Share knowledge like a seasoned sales professional with deep market understanding.`,
    
    'Procurement': `You are an expert Procurement & Supply Chain consultant for cement plants. Respond naturally and conversationally, offering guidance on vendor management, strategic sourcing, inventory optimization, compliance, and cost-saving strategies. Communicate like an experienced procurement professional with strong negotiation skills and supplier relationships.`,
    
    'Erection & Commissioning': `You are an expert Erection & Commissioning consultant for cement plants. Respond naturally and conversationally, providing expertise on installation sequencing, contractor management, safety protocols, pre-commissioning checks, and performance validation. Share knowledge like a field expert with hands-on experience.`,
    
    'Engineering & Design': `You are an expert Engineering & Design consultant for cement plants. Respond naturally and conversationally, offering insights on process flow design, plant layout, equipment selection, sustainability integration, and engineering best practices. Communicate like a senior design engineer with innovative solutions and technical depth.`
  };

  return roleSpecificInstructions[role];
};

// Convert file to base64 for Gemini API
const fileToGenerativePart = async (file: FileUpload) => {
  if (typeof file.content === 'string') {
    return {
      inlineData: {
        data: file.content.split(',')[1], // Remove data:mime;base64, prefix
        mimeType: file.type
      }
    };
  }
  
  // Convert ArrayBuffer to base64
  const bytes = new Uint8Array(file.content as ArrayBuffer);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  const base64 = btoa(binary);
  
  return {
    inlineData: {
      data: base64,
      mimeType: file.type
    }
  };
};

// Utility function to clean markdown (remove **bold** etc.)
function cleanMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
}

export const generateResponse = async (
  prompt: string, 
  role: UserRole | 'General AI', 
  isAuthenticated: boolean = true, // Always authenticated now
  files: FileUpload[] = []
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(role);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    let result;
    
    if (files.length > 0) {
      // Handle files with prompt
      const parts = [prompt];
      
      for (const file of files) {
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const filePart = await fileToGenerativePart(file);
          parts.push(filePart);
        }
      }
      
      result = await model.generateContent(parts);
    } else {
      result = await model.generateContent(prompt);
    }
    
    const response = await result.response;
    let text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('Empty response from API');
    }

    // Clean markdown before returning
    return cleanMarkdown(text);
  } catch (error) {
    console.error('Error generating response:', error);
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later or check your billing settings.');
      }
      if (error.message.includes('blocked')) {
        throw new Error('Content was blocked by safety filters. Please rephrase your question.');
      }
    }
    throw new Error('Technical system error occurred. Please try again or contact support.');
  }
};