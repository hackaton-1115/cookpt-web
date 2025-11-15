'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientCard } from '@/components/ingredient-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Search, ArrowLeft } from 'lucide-react'
import { recognizeIngredients } from '@/lib/ingredient-recognition'
import { RecognizedIngredient } from '@/lib/types'

export default function RecognizePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [imageData, setImageData] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<RecognizedIngredient[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage')
    if (!storedImage) {
      router.push('/')
      return
    }

    setImageData(storedImage)

    // Simulate AI recognition
    recognizeIngredients(storedImage).then((recognized) => {
      setIngredients(recognized)
      // Auto-select all ingredients with confidence > 80%
      const autoSelected = new Set(
        recognized.filter((i) => i.confidence > 0.8).map((i) => i.name)
      )
      setSelectedIngredients(autoSelected)
      setLoading(false)
    })
  }, [router])

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const handleFindRecipes = () => {
    if (selectedIngredients.size > 0) {
      const ingredientList = Array.from(selectedIngredients).join(',')
      router.push(`/recipes?ingredients=${encodeURIComponent(ingredientList)}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analyzing your image</h2>
          <p className="text-muted-foreground">
            Our AI is identifying the ingredients...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Recognized Ingredients
          </h1>
          <p className="text-muted-foreground">
            Review and select the ingredients you want to use
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <Card className="overflow-hidden mb-4">
              <img
                src={imageData || "/placeholder.svg"}
                alt="Uploaded ingredients"
                className="w-full h-auto max-h-80 object-cover"
              />
            </Card>
            <p className="text-sm text-muted-foreground text-center">
              Your uploaded photo
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Found {ingredients.length} ingredients
              </h2>
              <span className="text-sm text-muted-foreground">
                {selectedIngredients.size} selected
              </span>
            </div>

            {ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.name}
                name={ingredient.name}
                confidence={ingredient.confidence}
                category={ingredient.category}
                selected={selectedIngredients.has(ingredient.name)}
                onToggle={() => toggleIngredient(ingredient.name)}
              />
            ))}

            {ingredients.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No ingredients detected. Please try uploading a clearer image.
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleFindRecipes}
            disabled={selectedIngredients.size === 0}
            className="gap-2"
          >
            <Search className="h-5 w-5" />
            Find Recipes ({selectedIngredients.size} ingredients)
          </Button>
        </div>
      </div>
    </main>
  )
}
