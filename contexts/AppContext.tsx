// FoodFootprint - Global App Context

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ScanResult } from '@/services/foodEstimationService';
import { FoodItem } from '@/constants/foodData';

export interface AppContextType {
  // Current scan
  currentScan: ScanResult | null;
  setCurrentScan: (scan: ScanResult | null) => void;
  
  // Processing state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // History (in-memory, synced with storage)
  history: ScanResult[];
  addToHistory: (scan: ScanResult) => void;
  removeFromHistory: (scanId: string) => void;
  clearHistory: () => void;
  
  // Compare
  compareA: FoodItem | null;
  compareB: FoodItem | null;
  setCompareA: (food: FoodItem | null) => void;
  setCompareB: (food: FoodItem | null) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (foodId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [compareA, setCompareA] = useState<FoodItem | null>(null);
  const [compareB, setCompareB] = useState<FoodItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToHistory = useCallback((scan: ScanResult) => {
    setHistory(prev => [scan, ...prev].slice(0, 50));
  }, []);

  const removeFromHistory = useCallback((scanId: string) => {
    setHistory(prev => prev.filter(s => s.scanId !== scanId));
  }, []);

  const clearHistoryFn = useCallback(() => {
    setHistory([]);
  }, []);

  const toggleFavorite = useCallback((foodId: string) => {
    setFavorites(prev =>
      prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentScan,
        setCurrentScan,
        isProcessing,
        setIsProcessing,
        history,
        addToHistory,
        removeFromHistory,
        clearHistory: clearHistoryFn,
        compareA,
        compareB,
        setCompareA,
        setCompareB,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
