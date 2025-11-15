import { Cuisine } from './types';

export const CUISINES: Cuisine[] = [
  {
    id: 'korean',
    title: '한식',
    description: 'Korean',
    icon: '🇰🇷',
    examples: [],
  },
  {
    id: 'chinese',
    title: '중식',
    description: 'Chinese',
    icon: '🇨🇳',
    examples: [],
  },
  {
    id: 'japanese',
    title: '일식',
    description: 'Japanese',
    icon: '🇯🇵',
    examples: [],
  },
  {
    id: 'western',
    title: '양식',
    description: 'Western',
    icon: '🍴',
    examples: [],
  },
  {
    id: 'italian',
    title: '이탈리아식',
    description: 'Italian',
    icon: '🇮🇹',
    examples: [],
  },
  {
    id: 'thai',
    title: '태국식',
    description: 'Thai',
    icon: '🇹🇭',
    examples: [],
  },
  {
    id: 'vietnamese',
    title: '베트남식',
    description: 'Vietnamese',
    icon: '🇻🇳',
    examples: [],
  },
  {
    id: 'mexican',
    title: '멕시코식',
    description: 'Mexican',
    icon: '🇲🇽',
    examples: [],
  },
  {
    id: 'indian',
    title: '인도식',
    description: 'Indian',
    icon: '🇮🇳',
    examples: [],
  },
];

export const getCuisineById = (id: string): Cuisine | undefined => {
  // 메인 카테고리에서 찾기
  const mainCuisine = CUISINES.find((cuisine) => cuisine.id === id);
  if (mainCuisine) return mainCuisine;

  // 서브 카테고리에서 찾기
  for (const cuisine of CUISINES) {
    if (cuisine.subcuisines) {
      const subCuisine = cuisine.subcuisines.find((sub) => sub.id === id);
      if (subCuisine) return subCuisine;
    }
  }

  return undefined;
};

export const getAllCuisinesFlat = (): Cuisine[] => {
  const flat: Cuisine[] = [];
  CUISINES.forEach((cuisine) => {
    flat.push(cuisine);
    if (cuisine.subcuisines) {
      flat.push(...cuisine.subcuisines);
    }
  });
  return flat;
};
