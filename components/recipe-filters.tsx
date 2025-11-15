'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { COOKING_TOOLS, CATEGORIES } from '@/lib/recipe-data'

interface RecipeFiltersProps {
  selectedTools: string[]
  selectedCategories: string[]
  maxTime: number
  onToolsChange: (tools: string[]) => void
  onCategoriesChange: (categories: string[]) => void
  onMaxTimeChange: (time: number) => void
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
      onToolsChange(selectedTools.filter((t) => t !== tool))
    } else {
      onToolsChange([...selectedTools, tool])
    }
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Cooking Tools
          </Label>
          <div className="space-y-3">
            {COOKING_TOOLS.map((tool) => (
              <div key={tool} className="flex items-center space-x-2">
                <Checkbox
                  id={`tool-${tool}`}
                  checked={selectedTools.includes(tool)}
                  onCheckedChange={() => toggleTool(tool)}
                />
                <label
                  htmlFor={`tool-${tool}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                >
                  {tool}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Categories
          </Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={
                  selectedCategories.includes(category) ? 'default' : 'outline'
                }
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-semibold">Max Cooking Time</Label>
            <span className="text-sm font-medium text-primary">
              {maxTime} min
            </span>
          </div>
          <Slider
            value={[maxTime]}
            onValueChange={(value) => onMaxTimeChange(value[0])}
            min={10}
            max={120}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>10 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
