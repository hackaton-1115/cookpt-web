import { RecipeTheme } from './types';

export const RECIPE_THEMES: RecipeTheme[] = [
  // 시간/편의성 기반
  {
    id: 'quick-5min',
    title: '5분 준비 음식',
    description: '바쁜 아침이나 야식으로 빠르게 만드는 레시피',
    icon: 'Zap',
    category: 'time',
  },
  {
    id: 'beginner-friendly',
    title: '초보자도 실패 없는',
    description: '요리 경험이 없어도 쉽게 따라할 수 있는 레시피',
    icon: 'ThumbsUp',
    category: 'time',
  },
  {
    id: 'minimal-ingredients',
    title: '5가지 이하 재료',
    description: '재료가 많지 않아도 맛있게 만드는 간단 레시피',
    icon: 'ListChecks',
    category: 'time',
  },

  // 건강/식단 기반
  {
    id: 'high-protein',
    title: '단백질 보충 음식',
    description: '운동 후나 건강한 식단을 위한 고단백 레시피',
    icon: 'Dumbbell',
    category: 'health',
  },
  {
    id: 'low-calorie',
    title: '다이어트 저칼로리',
    description: '칼로리는 낮추고 영양은 챙기는 건강 레시피',
    icon: 'Heart',
    category: 'health',
  },
  {
    id: 'balanced-nutrition',
    title: '탄단지 균형 건강식',
    description: '탄수화물, 단백질, 지방의 균형을 맞춘 레시피',
    icon: 'Scale',
    category: 'health',
  },
  {
    id: 'vegetarian',
    title: '채식 위주',
    description: '고기 없이도 맛있는 채소 중심 레시피',
    icon: 'Leaf',
    category: 'health',
  },

  // 장비/조리법 기반
  {
    id: 'microwave-only',
    title: '전자레인지만 있으면 되는',
    description: '불 없이도 간편하게 만드는 레시피',
    icon: 'Microwave',
    category: 'equipment',
  },
  {
    id: 'one-pan',
    title: '프라이팬 하나로',
    description: '조리 도구 하나로 완성하는 간편 레시피',
    icon: 'UtensilsCrossed',
    category: 'equipment',
  },
  {
    id: 'minimal-cleanup',
    title: '설거지 최소화',
    description: '그릇 1~2개로 끝내는 설거지 걱정 없는 레시피',
    icon: 'Sparkles',
    category: 'equipment',
  },
  {
    id: 'low-smell',
    title: '냄새 적게 나는 조리법',
    description: '원룸·오피스텔에서도 부담 없는 레시피',
    icon: 'Wind',
    category: 'equipment',
  },

  // 상황/형태 기반
  {
    id: 'meal-prep',
    title: '도시락/밀프렙',
    description: '미리 만들어 보관하기 좋은 레시피',
    icon: 'Package',
    category: 'situation',
  },
  {
    id: 'drinking-snack',
    title: '술안주/홈술',
    description: '집에서 즐기는 맥주나 소주 한 잔에 어울리는 안주',
    icon: 'Beer',
    category: 'situation',
  },
  {
    id: 'cold-dish',
    title: '시원한 요리',
    description: '더운 날씨에 입맛 돋우는 시원한 레시피',
    icon: 'Snowflake',
    category: 'situation',
  },
  {
    id: 'hot-dish',
    title: '뜨끈한 요리',
    description: '추운 날 몸을 녹여주는 따뜻한 레시피',
    icon: 'Flame',
    category: 'situation',
  },
  {
    id: 'breakfast',
    title: '아침 공복에 부담 없는',
    description: '속이 편하고 가볍게 먹을 수 있는 아침 레시피',
    icon: 'Sunrise',
    category: 'situation',
  },
  {
    id: 'party-snack',
    title: '집들이용 간식/디저트',
    description: '손님 접대나 파티에 내놓기 좋은 특별한 레시피',
    icon: 'PartyPopper',
    category: 'situation',
  },
];

export const THEME_CATEGORIES = [
  {
    id: 'time' as const,
    title: '⏱️ 시간/편의성 기반',
    description: '빠르고 간편하게',
  },
  {
    id: 'health' as const,
    title: '💪 건강/식단 기반',
    description: '영양과 건강을 챙기는',
  },
  {
    id: 'equipment' as const,
    title: '🍳 장비/조리법 기반',
    description: '조리 환경에 맞춘',
  },
  {
    id: 'situation' as const,
    title: '🏠 상황/형태 기반',
    description: '상황에 딱 맞는',
  },
];

export const getThemesByCategory = (category: string) => {
  return RECIPE_THEMES.filter((theme) => theme.category === category);
};

export const getThemeById = (id: string) => {
  return RECIPE_THEMES.find((theme) => theme.id === id);
};
