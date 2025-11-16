export interface IngredientCategory {
  value: string;
  label: string;
  description: string;
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    value: 'Vegetable',
    label: '채소류',
    description: '양파, 당근, 배추, 시금치, 파, 마늘, 감자, 고구마, 버섯, 고추 등',
  },
  {
    value: 'Fruit',
    label: '과일류',
    description: '사과, 바나나, 토마토, 딸기, 포도 등',
  },
  {
    value: 'Meat',
    label: '육류',
    description: '돼지고기, 소고기, 닭고기, 양고기, 오리고기 등',
  },
  {
    value: 'Seafood',
    label: '해산물',
    description: '생선, 새우, 오징어, 조개, 게, 문어 등',
  },
  {
    value: 'Protein',
    label: '단백질',
    description: '계란, 두부, 콩 등',
  },
  {
    value: 'Grain',
    label: '곡물',
    description: '쌀, 밥, 면, 빵, 밀가루 등',
  },
  {
    value: 'Dairy',
    label: '유제품',
    description: '우유, 치즈, 요거트, 버터 등',
  },
  {
    value: 'Seasoning',
    label: '양념',
    description: '간장, 고추장, 된장, 식용유, 참기름, 소금, 설탕, 후추 등',
  },
  {
    value: 'Other',
    label: '기타',
    description: '위 카테고리에 속하지 않는 재료',
  },
];

export const getCategoryLabel = (value: string): string => {
  const category = INGREDIENT_CATEGORIES.find((cat) => cat.value === value);
  return category?.label || '기타';
};
