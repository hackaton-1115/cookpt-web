import { Recipe } from '@/lib/types'
import { RecipeCard } from './recipe-card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface RecipeThemeSectionProps {
  title: string
  description: string
  recipes: Recipe[]
  icon?: React.ReactNode
  themeQuery?: string
}

export function RecipeThemeSection({
  title,
  description,
  recipes,
  icon,
  themeQuery,
}: RecipeThemeSectionProps) {
  if (recipes.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {themeQuery && (
          <Link
            href={`/recipes?theme=${themeQuery}`}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.slice(0, 4).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  )
}
