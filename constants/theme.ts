// ─────────────────────────────────────────────
//  StockMate — Design System
//  Theme: Clean Light (Apple-inspired)
// ─────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  background:       '#F2F2F7', // iOS system grouped background
  surface:          '#FFFFFF',
  surfaceSecondary: '#F9F9FB',

  // Text
  textPrimary:      '#1C1C1E',
  textSecondary:    '#6C6C70',
  textTertiary:     '#AEAEB2',

  // Accent — clean blue (Apple blue)
  accent:           '#007AFF',
  accentLight:      '#E5F1FF',

  // Status colors
  inStock:          '#34C759',
  inStockBg:        '#E8F8EC',
  lowStock:         '#FF9500',
  lowStockBg:       '#FFF3E0',
  outOfStock:       '#FF3B30',
  outOfStockBg:     '#FFECEB',

  // Category chip colors
  catElectronics:   '#5856D6',
  catElectronicsBg: '#EEEEFF',
  catFurniture:     '#FF6B35',
  catFurnitureBg:   '#FFF0EB',
  catClothing:      '#FF2D55',
  catClothingBg:    '#FFEBEF',
  catFood:          '#34C759',
  catFoodBg:        '#E8F8EC',
  catTools:         '#FF9500',
  catToolsBg:       '#FFF3E0',
  catOther:         '#8E8E93',
  catOtherBg:       '#F2F2F7',

  // Borders & dividers
  border:           '#E5E5EA',
  divider:          '#C6C6C8',

  // Tab bar
  tabActive:        '#007AFF',
  tabInactive:      '#8E8E93',
  tabBackground:    '#FFFFFF',
};

export const Typography = {
  // Large title (screen heading)
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    color: Colors.textPrimary,
  },
  // Section title / card title
  title1: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.38,
    color: Colors.textPrimary,
  },
  title2: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  // Body
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
    color: Colors.textPrimary,
  },
  // Caption / meta
  caption1: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0,
    color: Colors.textSecondary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.06,
    color: Colors.textTertiary,
  },
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const Radius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
};