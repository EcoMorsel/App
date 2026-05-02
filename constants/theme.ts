// FoodFootprint Design System

export const Colors = {
  // Base
  background: '#0A0F0D',
  surface: '#111A13',
  surfaceElevated: '#182019',
  card: '#1E2B20',
  cardHover: '#243328',
  border: '#2A3D2C',
  borderLight: '#1E2D20',

  // Brand
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#4ADE80',
  primaryMuted: 'rgba(34,197,94,0.12)',

  // Accent
  amber: '#F59E0B',
  amberMuted: 'rgba(245,158,11,0.12)',

  // Resource Colors
  water: '#3B82F6',
  waterLight: '#60A5FA',
  waterMuted: 'rgba(59,130,246,0.12)',

  carbon: '#9CA3AF',
  carbonDark: '#6B7280',
  carbonMuted: 'rgba(156,163,175,0.12)',

  land: '#D97706',
  landLight: '#FCD34D',
  landMuted: 'rgba(217,119,6,0.12)',

  energy: '#F59E0B',
  energyLight: '#FDE68A',
  energyMuted: 'rgba(245,158,11,0.12)',

  packaging: '#A78BFA',
  packagingMuted: 'rgba(167,139,250,0.12)',

  // Text
  text: '#F0FFF4',
  textSecondary: '#A3C4A8',
  textMuted: '#5C7A62',
  textDisabled: '#3A4F3D',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  shimmer: 'rgba(255,255,255,0.04)',
  white: '#FFFFFF',
  black: '#000000',

  // Impact Level Colors
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#EF4444',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 34,
  hero: 42,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export default { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow };
