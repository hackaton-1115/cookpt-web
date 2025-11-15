import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface IngredientCardProps {
  name: string
  confidence: number
  category: string
  selected: boolean
  onToggle: () => void
}

export function IngredientCard({
  name,
  confidence,
  category,
  selected,
  onToggle,
}: IngredientCardProps) {
  return (
    <Card
      className={`p-3 sm:p-4 cursor-pointer transition-all ${
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary'
          : 'hover:border-primary/50'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-base sm:text-lg">{name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
        <Button
          size="icon"
          variant={selected ? 'default' : 'outline'}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0"
        >
          {selected ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>
    </Card>
  )
}
