// FoodFootprint - Food Analysis Hook

import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { analyzeText, analyzeImage, ScanResult } from '@/services/foodEstimationService';
import { useApp } from './useApp';

/**
 * Convert a blob/http URL to a base64 string using the web Fetch + FileReader APIs.
 */
async function blobUrlToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // Strip the "data:image/...;base64," prefix
      const base64 = dataUrl.split(',')[1];
      if (base64) resolve(base64);
      else reject(new Error('Failed to extract base64 from data URL'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function useFoodAnalysis() {
  const { setCurrentScan, setIsProcessing, addToHistory } = useApp();
  const [error, setError] = useState<string | null>(null);

  const analyzeFromText = useCallback(async (text: string): Promise<ScanResult | null> => {
    if (!text.trim()) {
      setError('Please enter a food name');
      return null;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      const result = await analyzeText(text.trim());
      setCurrentScan(result);
      addToHistory(result);
      return result;
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [setCurrentScan, setIsProcessing, addToHistory]);

  const analyzeFromImage = useCallback(async (uri: string, type: 'image' | 'camera' = 'image'): Promise<ScanResult | null> => {
    setError(null);
    setIsProcessing(true);

    try {
      // Read the image file and convert to base64 for the LLM vision API
      let imageBase64: string | undefined;
      try {
        if (Platform.OS === 'web') {
          // On web, expo-image-picker returns blob: or http: URLs — use Fetch + FileReader
          imageBase64 = await blobUrlToBase64(uri);
        } else {
          // On native, use expo-file-system to read the local file
          const { readAsStringAsync } = await import('expo-file-system/legacy');
          imageBase64 = await readAsStringAsync(uri, { encoding: 'base64' });
        }
      } catch (readErr) {
        console.warn('[FoodAnalysis] Failed to read image as base64:', readErr);
      }

      const result = await analyzeImage(uri, type, imageBase64);
      setCurrentScan(result);
      addToHistory(result);
      return result;
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [setCurrentScan, setIsProcessing, addToHistory]);

  return {
    analyzeFromText,
    analyzeFromImage,
    error,
    clearError: () => setError(null),
  };
}
