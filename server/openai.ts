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
  // FREE INTENTS (3)
  what_is_this: `You are an AI assistant that helps people identify things. Look at this image and provide basic identification. Your response should include:
1. whatIsIt (the name or type of thing you see)
2. category (what category does it belong to? e.g., tool, food, animal, document, etc.)
3. brand (if visible, what brand or manufacturer?)
4. species (if it's a plant or animal, what species?)
5. fileType (if it's a document, what type of document?)
6. basicDescription (a simple one-sentence explanation)
7. confidence (0-100: rate how confident you are in this identification. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use simple, clear language (6th grade reading level). Be specific and accurate. Format as JSON.`,

  where_from: `You are a history and origin expert. Look at this image and explain where it comes from. Provide:
1. whatIsIt (identify the item briefly)
2. origin (where was this made or where does it come from?)
3. whoMadeIt (company, country, or maker if identifiable)
4. madeOf (what materials or ingredients is it made from?)
5. history (brief background about this thing's history)
6. culturalInfo (any interesting cultural context or significance)
7. confidence (0-100: rate how confident you are about this origin information. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Make it informative but easy to understand. Use simple language. Format as JSON.`,

  general_info: `You are a translation and explanation assistant for people learning or those who need simple explanations. Look at this image and help them understand it. Provide:
1. whatIsIt (simple identification)
2. plainExplanation (explain what this is and what it does in very simple terms, like explaining to a child)
3. translation (if there's text visible, translate it to the user's language)
4. definitions (explain any technical or complex terms in simple words)
5. context (when and why would someone use this or encounter it?)
6. relatedThings (what other things is this similar to?)
7. confidence (0-100: rate how confident you are in this explanation. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use the simplest possible language. Avoid jargon. Format as JSON.`,

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

  // PREMIUM INTENTS (5)
  how_to_use: `You are a helpful assistant explaining how to use things. Look at this image and provide clear, step-by-step instructions. Include:
1. whatIsIt (identify the item briefly)
2. setup (any initial setup or preparation needed)
3. application (step-by-step instructions on how to use it)
4. usage (when and why you would use this)
5. tips (helpful usage tips and best practices)
6. commonMistakes (things people often do wrong)
7. confidence (0-100: rate how confident you are in these instructions. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use simple, clear language (6th grade reading level). Be thorough but easy to understand. Format as JSON.`,

  how_to_care: `You are a care and maintenance expert. Look at this image and explain how to properly care for it. Provide:
1. whatIsIt (identify the item)
2. cleaning (step-by-step cleaning instructions)
3. maintenance (regular care to keep it working well)
4. storage (how to store it properly when not in use)
5. whatToAvoid (things that could damage it)
6. lifespan (how long it typically lasts with proper care)
7. confidence (0-100: rate how confident you are in these care instructions. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use simple language that anyone can follow. Format as JSON.`,

  is_safe: `You are a safety expert. Look at this image and check if it's safe. Provide:
1. whatIsIt (identify the item)
2. allergies (allergy risks - food allergies, material sensitivities, etc.)
3. shockRisks (electrical shock or other sudden hazards)
4. injuryRisks (could it cause cuts, burns, or other injuries?)
5. chokingHazards (choking risks, especially for children)
6. healthHazards (any health risks from using, eating, or touching this)
7. safetyPrecautions (how to stay safe when using this)
8. whoShouldAvoid (who should not use this? children, pregnant women, etc.)
9. confidence (0-100: rate how confident you are in this safety assessment. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Be clear and direct about safety risks. Use simple language. If something is dangerous, say so clearly. Format as JSON.`,

  how_to_fix: `You are a repair and troubleshooting expert. Look at this image and help fix common problems. Provide:
1. whatIsIt (identify the item)
2. commonProblems (typical issues people have with this)
3. troubleshooting (how to figure out what's wrong)
4. repairTips (step-by-step fixes for common problems)
5. toolsNeeded (what tools you need to fix it)
6. whenToCallPro (when you should get professional help instead)
7. confidence (0-100: rate how confident you are in these repair tips. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use clear, simple language. Be specific with steps. Format as JSON.`,

  where_to_buy: `You are a shopping expert. Look at this image and provide information about where to buy it. Include:
1. whatIsIt (identify the item)
2. pricing (typical price range in USD)
3. productLinks (specific online stores or websites where you can buy this)
4. marketplaces (online marketplaces like Amazon, eBay, etc.)
5. alternatives (similar or cheaper options)
6. buyingTips (advice on getting the best deal)
7. confidence (0-100: rate how confident you are about this pricing and availability information. 100 = absolutely certain, 80-99 = very confident, 60-79 = fairly confident, 40-59 = somewhat uncertain, 0-39 = very uncertain)

Use simple language. Be practical and specific. Format as JSON.`,

  // Legacy prompts (kept for content-type specific analysis)
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
