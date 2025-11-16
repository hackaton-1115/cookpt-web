export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  category: string;
  cookingTools: string[];
  tags: string[];
  likesCount?: number;
}

export interface RecognizedIngredient {
  name: string;
  confidence: number;
  category: string;
}

// API Request/Response types
export interface RecognizeImageRequest {
  imageData: string; // base64 encoded image
}

export interface RecognizeImageResponse {
  success: boolean;
  data?: RecognizedIngredient[];
  error?: string;
}

export interface GenerateRecipesRequest {
  ingredients: string[]; // 재료 목록
  theme?: string; // 테마 ID (예: "quick", "microwave")
  cuisine?: string; // 국적 ID (예: "korean", "japanese")
  tools?: string[]; // 조리 도구 ID 배열
}

export interface GenerateRecipesResponse {
  success: boolean;
  data?: Recipe[];
  error?: string;
}

// Theme types
export type ThemeCategory = 'time' | 'health' | 'equipment' | 'situation';

export interface RecipeTheme {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide-react 아이콘 이름
  category: ThemeCategory;
}

// Cuisine types
export interface Cuisine {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide-react 아이콘 이름 또는 이모지
  examples: string[]; // 대표 음식 예시
  subcuisines?: Cuisine[]; // 하위 카테고리 (예: 양식 > 이탈리아식)
}

// Cooking Tool types
export interface CookingTool {
  id: string;
  title: string;
  icon: string; // lucide-react 아이콘 이름
}
