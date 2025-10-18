import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI GPT-4 Vision pricing (per 1000 tokens)
// We apply 100% markup to these prices
const OPENAI_INPUT_COST_PER_1K = 0.01; // $0.01 per 1000 input tokens
const OPENAI_OUTPUT_COST_PER_1K = 0.03; // $0.03 per 1000 output tokens
const MARKUP_MULTIPLIER = 2; // 100% markup

export function calculateTokenCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1000) * OPENAI_INPUT_COST_PER_1K * MARKUP_MULTIPLIER;
  const outputCost = (outputTokens / 1000) * OPENAI_OUTPUT_COST_PER_1K * MARKUP_MULTIPLIER;
  return Math.ceil((inputCost + outputCost) * 100) / 100; // Round to 2 decimals
}

export function calculateTokensFromCost(costUsd: number): number {
  // Estimate tokens needed based on cost (conservative estimate)
  // Assume average of input and output costs
  const avgCostPerToken = ((OPENAI_INPUT_COST_PER_1K + OPENAI_OUTPUT_COST_PER_1K) / 2 / 1000) * MARKUP_MULTIPLIER;
  return Math.ceil(costUsd / avgCostPerToken);
}

// System prompts for different analysis types
export const SYSTEM_PROMPTS = {
  general: `You are an AI assistant that helps seniors and non-English speakers understand images. Your goal is to:
1. Describe what you see in simple, clear language (6th grade reading level)
2. Identify the main subject or content type
3. Provide helpful context and information
4. If it's a product, include details about what it is and typical uses
5. If it's a document, summarize the key information
6. If it's food, describe it and mention if it's commonly associated with recipes

Be warm, patient, and thorough. Use simple words and short sentences.

Respond with:
1. contentType (one of: product, document, food, scene, person, animal, other)
2. description (detailed, simple explanation)
3. additionalInfo (helpful context, safety info, or usage tips if relevant)

Format your response as JSON.`,

  product: `You are a product information assistant. Analyze this product image and provide:
1. productName (what is this product called?)
2. description (what is it used for, in simple terms?)
3. category (type of product)
4. safetyInfo (any important safety information)
5. wikipediaQuery (suggested search term for Wikipedia)

Use simple language (6th grade reading level). Format as JSON.`,

  document: `You are a document reading assistant for seniors and non-English speakers. Read this document and:
1. Identify the document type (letter, form, receipt, instruction, etc.)
2. Summarize the main points in simple language
3. Highlight any important dates, numbers, or actions needed
4. Explain any complex terms in simple words

Format as JSON with:
1. documentType
2. summary
3. importantDetails (array of key points)
4. simplifiedExplanation

Use 6th grade reading level.`,

  food: `You are a food and recipe assistant. Analyze this food image and provide:
1. foodName (what is this dish/food?)
2. description (what it is, common ingredients)
3. hasRecipe (true/false - is this something people commonly make at home?)
4. cuisine (what type of cuisine is this?)
5. dietaryInfo (vegetarian, contains nuts, etc.)

If hasRecipe is true, also provide:
6. ingredients (estimated list of main ingredients)
7. basicInstructions (simple cooking steps)

Use simple language. Format as JSON.`,
};

export interface GeneralAnalysis {
  contentType: "product" | "document" | "food" | "scene" | "person" | "animal" | "other";
  description: string;
  additionalInfo?: string;
}

export interface ProductAnalysis extends GeneralAnalysis {
  productName?: string;
  category?: string;
  safetyInfo?: string;
  wikipediaQuery?: string;
}

export interface DocumentAnalysis extends GeneralAnalysis {
  documentType?: string;
  summary?: string;
  importantDetails?: string[];
  simplifiedExplanation?: string;
}

export interface FoodAnalysis extends GeneralAnalysis {
  foodName?: string;
  hasRecipe?: boolean;
  cuisine?: string;
  dietaryInfo?: string;
  ingredients?: string[];
  basicInstructions?: string[];
}

export type AnalysisResult = ProductAnalysis | DocumentAnalysis | FoodAnalysis | GeneralAnalysis;
