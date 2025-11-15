import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, ChefHat, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RECIPES } from '@/lib/recipe-data'

export async function generateStaticParams() {
  return RECIPES.map((recipe) => ({
    id: recipe.id,
  }))
}

export default function RecipeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const recipe = RECIPES.find((r) => r.id === params.id)

  if (!recipe) {
    notFound()
  }

  const totalTime = recipe.prepTime + recipe.cookTime

  const difficultyColor = {
    easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        <Link href="/recipes">
          <Button variant="ghost" className="mb-4 sm:mb-6" size="sm">
            <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8">
          <div className="md:col-span-3 space-y-4 sm:space-y-6">
            <div>
              <div className="relative h-56 sm:h-72 md:h-96 rounded-lg overflow-hidden mb-3 sm:mb-4">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                <Badge className={difficultyColor[recipe.difficulty] + " text-xs"}>
                  {recipe.difficulty}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 text-balance">
                {recipe.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty">
                {recipe.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">{totalTime}</div>
                  <div className="text-xs text-muted-foreground">minutes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">{recipe.servings}</div>
                  <div className="text-xs text-muted-foreground">servings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xs sm:text-sm font-bold truncate">{recipe.category}</div>
                  <div className="text-xs text-muted-foreground">category</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-xl sm:text-2xl font-bold">
                    {recipe.nutrition.calories}
                  </div>
                  <div className="text-xs text-muted-foreground">calories</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 sm:space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 text-sm sm:text-base">
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          {' '}
                          - {ingredient.amount}
                          {ingredient.unit ? ` ${ingredient.unit}` : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 sm:space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 sm:gap-4">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1 text-pretty text-sm sm:text-base">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Nutrition Facts</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Per serving ({recipe.servings} servings)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Calories</span>
                      <span className="font-bold">
                        {recipe.nutrition.calories} kcal
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(recipe.nutrition.calories / 800) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Protein</span>
                      <span className="font-bold">
                        {recipe.nutrition.protein}g
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${(recipe.nutrition.protein / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Carbs</span>
                      <span className="font-bold">
                        {recipe.nutrition.carbs}g
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(recipe.nutrition.carbs / 100) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fat</span>
                      <span className="font-bold">
                        {recipe.nutrition.fat}g
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${(recipe.nutrition.fat / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fiber</span>
                      <span className="font-bold">
                        {recipe.nutrition.fiber}g
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(recipe.nutrition.fiber / 20) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Cooking Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.cookingTools.map((tool) => (
                    <Badge key={tool} variant="outline" className="capitalize text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Time Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Prep Time
                  </span>
                  <span className="font-semibold">{recipe.prepTime} min</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Cook Time
                  </span>
                  <span className="font-semibold">{recipe.cookTime} min</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total Time</span>
                  <span className="font-bold text-primary">
                    {totalTime} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
