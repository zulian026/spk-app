// types/recommendation.ts
import { LaptopData } from "@/lib/topsis";

export interface UserPreferences {
  price_weight: number;
  performance_weight: number;
  ram_weight: number;
  storage_weight: number;
  weight_importance: number;
  battery_weight: number;
  max_budget?: number;
  min_budget: number;
  preferred_brands: string[];
  primary_usage: string;
  screen_size_preference: string;
}

export interface LaptopWithDetails extends LaptopData {
  brand: string;
  name: string;
  graphics_card: string;
  screen_size: number;
  screen_resolution: string;
  storage_type: string;
  image_url?: string;
  description?: string;
  avg_rating?: number;
  review_count?: number;
}