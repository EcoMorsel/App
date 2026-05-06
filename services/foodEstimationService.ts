// FoodFootprint - Food Estimation Service

import { FOOD_DATABASE, KEYWORD_MAP, CATEGORY_ESTIMATES, FoodItem, FoodResource } from '@/constants/foodData';
import { queryFoodResources } from '@/services/llmService';

export interface ScanResult {
  food: FoodItem;
  inputType: 'image' | 'text' | 'camera';
  rawInput?: string;
  timestamp: number;
  scanId: string;
}

function generateScanId(): string {
  return 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
}

function findFoodByKeyword(input: string): FoodItem | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Direct match
  for (const [key, foodId] of Object.entries(KEYWORD_MAP)) {
    if (lowerInput.includes(key)) {
      return FOOD_DATABASE[foodId] || null;
    }
  }
  
  // Category-based fallback
  return null;
}

function generateGenericFood(name: string): FoodItem {
  const lowerName = name.toLowerCase();
  
  // Determine category
  let category = 'Mixed Dish';
  let emoji = '🍽️';
  let impactLevel: 'low' | 'medium' | 'high' = 'medium';
  
  if (lowerName.match(/vegetable|veggie|salad|greens|broccoli|carrot|spinach/)) {
    category = 'Vegetables';
    emoji = '🥦';
    impactLevel = 'low';
  } else if (lowerName.match(/fruit|berry|citrus|mango|pear|peach|grape/)) {
    category = 'Fruit';
    emoji = '🍑';
    impactLevel = 'low';
  } else if (lowerName.match(/beef|steak|veal|lamb|mutton/)) {
    category = 'Beef/Lamb';
    emoji = '🥩';
    impactLevel = 'high';
  } else if (lowerName.match(/pork|bacon|ham|sausage/)) {
    category = 'Pork';
    emoji = '🥓';
    impactLevel = 'high';
  } else if (lowerName.match(/chicken|turkey|duck|poultry/)) {
    category = 'Poultry';
    emoji = '🍗';
    impactLevel = 'medium';
  } else if (lowerName.match(/fish|salmon|tuna|shrimp|seafood/)) {
    category = 'Fish (farmed)';
    emoji = '🐟';
    impactLevel = 'medium';
  } else if (lowerName.match(/milk|cheese|yogurt|dairy|butter/)) {
    category = 'Dairy';
    emoji = '🧀';
    impactLevel = 'medium';
  } else if (lowerName.match(/bread|rice|wheat|grain|cereal|oat/)) {
    category = 'Grains';
    emoji = '🌾';
    impactLevel = 'low';
  }
  
  const catData = CATEGORY_ESTIMATES[category] || CATEGORY_ESTIMATES['Mixed Dish'];
  const servingMultiplier = 0.15; // 150g serving
  
  const resources: FoodResource = {
    water: Math.round((catData.water || 1200) * servingMultiplier),
    carbon: parseFloat(((catData.carbon || 2.0) * servingMultiplier).toFixed(2)),
    land: parseFloat(((catData.land || 3.0) * servingMultiplier).toFixed(2)),
    energy: parseFloat(((catData.energy || 2.0) * servingMultiplier).toFixed(2)),
    packaging: 30,
  };
  
  const glasses = Math.round(resources.water / 20);
  const kmDriving = parseFloat((resources.carbon / 0.25).toFixed(1));
  
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    category,
    emoji,
    servingSize: '1 serving (~150g)',
    servingGrams: 150,
    resources,
    ingredients: [
      {
        name: `${name} (main)`,
        portion: '150g',
        water: resources.water,
        carbon: resources.carbon,
        land: resources.land,
        energy: resources.energy,
        icon: emoji,
        color: '#22C55E',
        note: 'Estimated based on food category averages',
      },
    ],
    confidenceScore: 0.65,
    impactLevel,
    funFacts: [
      `This is an estimated value based on typical ${category.toLowerCase()} production`,
      'Actual values vary based on farming method, region, and season',
      'Locally sourced food typically has 30-50% lower transport emissions',
    ],
    waterComparison: `${glasses} drinking glasses`,
    carbonComparison: `${kmDriving} km of car driving`,
    tags: [category.toLowerCase(), 'estimated'],
  };
}

/**
 * Analyze food from text input using the LLM.
 * Falls back to local keyword matching + generic estimation if LLM fails.
 */
export async function analyzeText(text: string): Promise<ScanResult> {
  try {
    const llmResult = await queryFoodResources(text.trim());
    const food: FoodItem = {
      ...llmResult,
      id: llmResult.name.toLowerCase().replace(/\s+/g, '-'),
      confidenceScore: 0.92,
    };

    return {
      food,
      inputType: 'text',
      rawInput: text,
      timestamp: Date.now(),
      scanId: generateScanId(),
    };
  } catch (err) {
    console.warn('[FoodEstimation] LLM text analysis failed, using local fallback:', err);
    // Fallback to local keyword matching
    const found = findFoodByKeyword(text);
    const food = found || generateGenericFood(text);

    return {
      food,
      inputType: 'text',
      rawInput: text,
      timestamp: Date.now(),
      scanId: generateScanId(),
    };
  }
}

/**
 * Analyze food from an image using the LLM's vision capabilities.
 * Falls back to local generic estimation if LLM fails.
 *
 * @param imageUri - Local file URI of the image
 * @param inputType - Whether image was from gallery or camera
 * @param imageBase64 - Base64-encoded image data for the LLM
 */
export async function analyzeImage(
  imageUri: string,
  inputType: 'image' | 'camera' = 'image',
  imageBase64?: string,
): Promise<ScanResult> {
  try {

    if (!imageBase64) {
      throw new Error('No base64 image data provided');
    }

    const llmResult = await queryFoodResources('', imageBase64);
    const food: FoodItem = {
      ...llmResult,
      id: llmResult.name.toLowerCase().replace(/\s+/g, '-'),
      confidenceScore: 0.88,
    };

    return {
      food,
      inputType,
      rawInput: imageUri,
      timestamp: Date.now(),
      scanId: generateScanId(),
    };
  } catch (err) {
    console.warn('[FoodEstimation] LLM image analysis failed, using local fallback:', err);
    // Fallback to generic food
    const food = generateGenericFood('Unknown Food');

    return {
      food,
      inputType,
      rawInput: imageUri,
      timestamp: Date.now(),
      scanId: generateScanId(),
    };
  }
}

export function getFoodById(id: string): FoodItem | null {
  return FOOD_DATABASE[id] || null;
}

export function getAllFoods(): FoodItem[] {
  return Object.values(FOOD_DATABASE);
}

export function compareResources(food1: FoodItem, food2: FoodItem) {
  const keys: (keyof FoodResource)[] = ['water', 'carbon', 'land', 'energy', 'packaging'];
  const result: Record<string, { food1: number; food2: number; ratio: number; winner: string }> = {};
  
  for (const key of keys) {
    const v1 = food1.resources[key];
    const v2 = food2.resources[key];
    result[key] = {
      food1: v1,
      food2: v2,
      ratio: v1 > 0 ? v2 / v1 : 1,
      winner: v1 <= v2 ? food1.id : food2.id,
    };
  }
  
  return result;
}
