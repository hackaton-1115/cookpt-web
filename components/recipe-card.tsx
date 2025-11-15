import Link from 'next/link'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Recipe } from '@/lib/types'

interface RecipeCardProps {
  recipe: Recipe
  matchPercentage?: number
}

export function RecipeCard({ recipe, matchPercentage }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  const difficultyColor = {
    easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group">
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {matchPercentage !== undefined && matchPercentage > 0 && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-primary text-primary-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
              {Math.round(matchPercentage)}% match
            </div>
          )}
          <Badge
            className={`absolute top-2 sm:top-3 left-2 sm:left-3 text-xs ${
              difficultyColor[recipe.difficulty]
            }`}
          >
            {recipe.difficulty}
          </Badge>
        </div>

        <CardContent className="p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
            {recipe.description}
          </p>

          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">{recipe.category}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 sm:p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
