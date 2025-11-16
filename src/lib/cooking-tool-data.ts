import { CookingTool } from './types';

export const COOKING_TOOLS: CookingTool[] = [
  {
    id: 'microwave',
    title: '전자레인지',
    icon: 'Microwave',
  },
  {
    id: 'stove',
    title: '가스레인지/인덕션',
    icon: 'Flame',
  },
  {
    id: 'oven',
    title: '오븐',
    icon: 'Oven',
  },
  {
    id: 'air-fryer',
    title: '에어프라이어',
    icon: 'Wind',
  },
  {
    id: 'rice-cooker',
    title: '전기밥솥',
    icon: 'CookingPot',
  },
  {
    id: 'toaster',
    title: '토스터기',
    icon: 'Sandwich',
  },
  {
    id: 'blender',
    title: '믹서기/블렌더',
    icon: 'Blend',
  },
  {
    id: 'no-heat',
    title: '불 사용 안함',
    icon: 'Snowflake',
  },
];

export const getToolById = (id: string): CookingTool | undefined => {
  return COOKING_TOOLS.find((tool) => tool.id === id);
};
