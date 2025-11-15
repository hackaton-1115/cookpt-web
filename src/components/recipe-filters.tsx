'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { COOKING_TOOLS, CATEGORIES } from '@/lib/recipe-data';

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
    <Card className='sticky top-6 p-6'>
      <h2 className='mb-6 text-xl font-bold'>Filters</h2>

      <div className='space-y-6'>
        <div>
          <Label className='mb-3 block text-base font-semibold'>Cooking Tools</Label>
          <div className='space-y-3'>
            {COOKING_TOOLS.map((tool) => (
              <div key={tool} className='flex items-center space-x-2'>
                <Checkbox
                  id={`tool-${tool}`}
                  checked={selectedTools.includes(tool)}
                  onCheckedChange={() => toggleTool(tool)}
                />
                <label
                  htmlFor={`tool-${tool}`}
                  className='cursor-pointer text-sm leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {tool}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className='mb-3 block text-base font-semibold'>Categories</Label>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className='mb-3 flex items-center justify-between'>
            <Label className='text-base font-semibold'>Max Cooking Time</Label>
            <span className='text-primary text-sm font-medium'>{maxTime} min</span>
          </div>
          <Slider
            value={[maxTime]}
            onValueChange={(value) => onMaxTimeChange(value[0])}
            min={10}
            max={120}
            step={5}
            className='w-full'
          />
          <div className='text-muted-foreground mt-2 flex justify-between text-xs'>
            <span>10 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
