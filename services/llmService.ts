// EcoMorsel - LLM Service (via Proxy Server)

import { FoodItem, FoodResource } from '@/constants/foodData';

// Proxy URL from environment variable (set in .env as EXPO_PUBLIC_PROXY_URL).
// Defaults to the deployed Next.js API route.
const PROXY_URL = process.env.EXPO_PUBLIC_PROXY_URL || 'https://ecomorsel.vercel.app/analyze';
const API_SECRET = process.env.EXPO_PUBLIC_API_SECRET;

/**
 * Validate and fill in any missing fields in the parsed food data.
 */
function validateAndNormalize(data: any): Omit<FoodItem, 'id' | 'confidenceScore'> {
  const resources: FoodResource = {
    water: Number(data.resources?.water) || 100,
    carbon: Number(data.resources?.carbon) || 0.5,
    land: Number(data.resources?.land) || 0.5,
    energy: Number(data.resources?.energy) || 0.3,
    packaging: Number(data.resources?.packaging) || 10,
  };

  const glasses = Math.round(resources.water / 20);
  const kmDriving = parseFloat((resources.carbon / 0.25).toFixed(1));

  return {
    name: data.name || 'Unknown Food',
    category: data.category || 'Mixed Dish',
    emoji: data.emoji || '🍽️',
    servingSize: data.servingSize || '1 serving',
    servingGrams: Number(data.servingGrams) || 150,
    impactLevel: ['low', 'medium', 'high'].includes(data.impactLevel) ? data.impactLevel : 'medium',
    resources,
    ingredients: Array.isArray(data.ingredients) && data.ingredients.length > 0
      ? data.ingredients.map((ing: any) => ({
          name: ing.name || 'Ingredient',
          portion: ing.portion || '',
          water: Number(ing.water) || 0,
          carbon: Number(ing.carbon) || 0,
          land: Number(ing.land) || 0,
          energy: Number(ing.energy) || 0,
          icon: ing.icon || '🔹',
          color: ing.color || '#6B7280',
          note: ing.note,
        }))
      : [{
          name: data.name || 'Main',
          portion: `${data.servingGrams || 150}g`,
          water: resources.water,
          carbon: resources.carbon,
          land: resources.land,
          energy: resources.energy,
          icon: data.emoji || '🍽️',
          color: '#22C55E',
        }],
    funFacts: Array.isArray(data.funFacts) && data.funFacts.length > 0
      ? data.funFacts.slice(0, 3)
      : ['Environmental data based on lifecycle assessment estimates'],
    waterComparison: data.waterComparison || `${glasses} drinking glasses`,
    carbonComparison: data.carbonComparison || `${kmDriving} km of car driving`,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}

/**
 * Query the EcoMorsel proxy server which forwards to Google Gemini.
 *
 * @param foodName - Name of the food (used for text-based queries)
 * @param imageBase64 - Optional base64-encoded image for vision-based queries
 * @returns Partial FoodItem data (without id and confidenceScore)
 */
export async function queryFoodResources(
  foodName: string,
  imageBase64?: string,
): Promise<Omit<FoodItem, 'id' | 'confidenceScore'>> {
  console.log('[LLM] Sending request to proxy', imageBase64 ? '(with image)' : '(text-only)');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (API_SECRET) {
    headers['x-api-secret'] = API_SECRET;
  }

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ foodName, imageBase64 }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('[LLM] Proxy error:', response.status, errBody);
    throw new Error(`Proxy returned ${response.status}: ${errBody}`);
  }

  const parsed = await response.json();
  console.log('[LLM] Proxy response received:', parsed.name);

  return validateAndNormalize(parsed);
}
