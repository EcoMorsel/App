// FoodFootprint - Storage Service (AsyncStorage)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult } from './foodEstimationService';

const HISTORY_KEY = '@foodfootprint_history';
const FAVORITES_KEY = '@foodfootprint_favorites';
const SETTINGS_KEY = '@foodfootprint_settings';

export async function saveToHistory(scan: ScanResult): Promise<void> {
  try {
    const existing = await getHistory();
    const updated = [scan, ...existing].slice(0, 50); // Keep last 50 scans
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export async function getHistory(): Promise<ScanResult[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export async function removeFromHistory(scanId: string): Promise<void> {
  try {
    const existing = await getHistory();
    const updated = existing.filter(s => s.scanId !== scanId);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove from history:', error);
  }
}

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function toggleFavorite(foodId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const isFav = favorites.includes(foodId);
    const updated = isFav
      ? favorites.filter(id => id !== foodId)
      : [...favorites, foodId];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !isFav;
  } catch {
    return false;
  }
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
  showDisclaimer: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  darkMode: true,
  units: 'metric',
  showDisclaimer: true,
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
