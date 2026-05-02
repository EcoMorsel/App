// FoodFootprint - Food Analysis Hook

import { useState, useCallback } from 'react';
import { analyzeText, analyzeImage, ScanResult } from '@/services/foodEstimationService';
import { useApp } from './useApp';

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
      const result = await analyzeImage(uri, type);
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
