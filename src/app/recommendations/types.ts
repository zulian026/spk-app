// types.ts
export interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  processor: string;
  processor_score: number;
  ram: number;
  storage: number;
  storage_type: string;
  graphics_card: string;
  graphics_type: string;
  screen_size: number;
  screen_resolution: string;
  weight: number;
  battery_life: number;
  operating_system: string;
  description: string;
  image_url: string;
  avg_rating: number;
  review_count: number;
}

export interface UserPreferences {
  price_weight: number;
  performance_weight: number;
  ram_weight: number;
  storage_weight: number;
  weight_importance: number;
  battery_weight: number;
  max_budget: number;
  min_budget: number;
  preferred_brands: string[];
  primary_usage: string;
  screen_size_preference: string;
}

export interface Recommendation {
  laptop: Laptop;
  topsis_score: number;
  rank_position: number;
  normalized_values: any;
  weighted_values: any;
  distance_positive: number;
  distance_negative: number;
}

export const BRANDS = ["ASUS", "Lenovo", "HP", "Dell", "Apple", "Acer", "MSI"];

export const USAGE_TYPES = [
  { value: "gaming", label: "Gaming & Entertainment" },
  { value: "office", label: "Office & Business" },
  { value: "design", label: "Design & Creative" },
  { value: "student", label: "Student & Learning" },
  { value: "multimedia", label: "Multimedia & Content" },
  { value: "programming", label: "Programming & Development" },
];

export const SCREEN_SIZE_OPTIONS = [
  { value: "small", label: 'Portable (≤13")' },
  { value: "medium", label: 'Standard (14-15")' },
  { value: "large", label: 'Large (≥16")' },
];