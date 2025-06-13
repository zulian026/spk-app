// src/types/category.ts
export interface LaptopCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface CategoryResponse {
  success: boolean;
  data?: LaptopCategory | LaptopCategory[];
  message?: string;
  error?: string;
  count?: number;
}
