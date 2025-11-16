'use client';

import { PixelCheckbox } from '@/components/ui/pixel-checkbox';
import { CATEGORIES, COOKING_TOOLS } from '@/lib/recipe-data';

interface RecipeFiltersProps {
  selectedTools: string[];
  selectedCategories: string[];
  maxTime: number;
  onToolsChange: (tools: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onMaxTimeChange: (time: number) => void;
}

export function RecipeFilters({
  selectedTools,
  selectedCategories,
  maxTime,
  onToolsChange,
  onCategoriesChange,
  onMaxTimeChange,
}: RecipeFiltersProps) {
  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      onToolsChange(selectedTools.filter((t) => t !== tool));
    } else {
      onToolsChange([...selectedTools, tool]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div className='sticky top-6 border-4 border-[#5d4037] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(93,64,55,1)]'>
      <h2 className='pixel-text mb-6 text-xs text-[#5d4037]'>Filters</h2>

      <div className='space-y-6'>
        {/* Cooking Tools */}
        <div>
          <label className='pixel-text mb-3 block text-xs text-[#5d4037]'>Cooking Tools</label>
          <div className='space-y-3'>
            {COOKING_TOOLS.map((tool) => (
              <div key={tool} className='flex items-center gap-2'>
                <PixelCheckbox
                  checked={selectedTools.includes(tool)}
                  onToggle={() => toggleTool(tool)}
                />
                <label
                  onClick={() => toggleTool(tool)}
                  className='flex-1 cursor-pointer text-sm text-[#5d4037] capitalize'
                >
                  {tool}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className='pixel-text mb-3 block text-xs text-[#5d4037]'>Categories</label>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`border-2 px-3 py-1 text-xs transition-all ${
                  selectedCategories.includes(category)
                    ? 'border-[#ff5252] bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                    : 'border-[#5d4037] bg-white text-[#5d4037] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Max Cooking Time */}
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <label className='pixel-text text-xs text-[#5d4037]'>Max Cooking Time</label>
            <span className='text-sm font-bold text-[#ff5252]'>{maxTime} min</span>
          </div>

          {/* Pixel-style slider */}
          <div className='relative'>
            <input
              type='range'
              min={10}
              max={120}
              step={5}
              value={maxTime}
              onChange={(e) => onMaxTimeChange(Number(e.target.value))}
              className='h-2 w-full cursor-pointer appearance-none border-2 border-[#5d4037] bg-[#ffe0e0] shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#5d4037] [&::-moz-range-thumb]:bg-[#ff5252] [&::-moz-range-thumb]:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5d4037] [&::-webkit-slider-thumb]:bg-[#ff5252] [&::-webkit-slider-thumb]:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)]'
            />
          </div>

          <div className='mt-2 flex justify-between text-xs text-[#5d4037]/70'>
            <span>10 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
