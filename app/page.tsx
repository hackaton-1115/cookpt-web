'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/image-upload'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [imageData, setImageData] = useState<string | null>(null)

  const handleAnalyze = () => {
    if (imageData) {
      window.location.href = '/recognize'
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 text-balance">
            Discover Recipes from Your Ingredients
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-balance">
            Upload a photo of your ingredients and get personalized Korean
            recipe recommendations
          </p>
        </div>

        <div className="space-y-6">
          <ImageUpload
            onImageSelect={(data) => {
              setImageData(data)
              localStorage.setItem('uploadedImage', data)
            }}
          />

          {imageData && (
            <div className="flex justify-center">
              <Button onClick={handleAnalyze} size="lg" className="gap-2">
                Analyze Ingredients
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 rounded-lg bg-muted/50">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">01</div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Upload Photo</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Take or upload a photo of your ingredients
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 rounded-lg bg-muted/50">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">02</div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">AI Recognition</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our AI identifies your ingredients automatically
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 rounded-lg bg-muted/50">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">03</div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Get Recipes</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Receive personalized Korean recipe recommendations
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Or explore recipes by theme
          </p>
          <Link href="/recipes">
            <Button variant="outline" size="lg">
              Browse Recipe Themes
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
