'use client';

import { Loader2, Search, ArrowLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { IngredientCard } from '@/components/ingredient-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { recognizeIngredients } from '@/lib/ingredient-recognition';
import { RecognizedIngredient } from '@/lib/types';

export default function RecognizePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<RecognizedIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage');
    if (!storedImage) {
      router.push('/');
      return;
    }

    setImageData(storedImage);

    // Simulate AI recognition
    recognizeIngredients(storedImage).then((recognized) => {
      setIngredients(recognized);
      // Auto-select all ingredients with confidence > 80%
      const autoSelected = new Set(recognized.filter((i) => i.confidence > 0.8).map((i) => i.name));
      setSelectedIngredients(autoSelected);
      setLoading(false);
    });
  }, [router]);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleFindRecipes = () => {
    if (selectedIngredients.size > 0) {
      const ingredientList = Array.from(selectedIngredients).join(',');
      router.push(`/recipes?ingredients=${encodeURIComponent(ingredientList)}`);
    }
  };

  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto mb-4 h-12 w-12 animate-spin' />
          <h2 className='mb-2 text-xl font-semibold'>Analyzing your image</h2>
          <p className='text-muted-foreground'>Our AI is identifying the ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8'>
        <Button variant='ghost' onClick={() => router.push('/')} className='mb-4 sm:mb-6' size='sm'>
          <ArrowLeft className='mr-1 h-4 w-4 sm:mr-2' />
          Back
        </Button>

        <div className='mb-6 sm:mb-8'>
          <h1 className='text-foreground mb-2 text-2xl font-bold sm:mb-3 sm:text-3xl'>
            Recognized Ingredients
          </h1>
          <p className='text-muted-foreground text-sm sm:text-base'>
            Review and select the ingredients you want to use
          </p>
        </div>

        <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-6 md:grid-cols-2'>
          <div>
            <Card className='mb-3 overflow-hidden sm:mb-4'>
              <img
                src={imageData || '/placeholder.svg'}
                alt='Uploaded ingredients'
                className='h-auto max-h-64 w-full object-cover sm:max-h-80'
              />
            </Card>
            <p className='text-muted-foreground text-center text-xs sm:text-sm'>
              Your uploaded photo
            </p>
          </div>

          <div className='space-y-2 sm:space-y-3'>
            <div className='mb-3 flex items-center justify-between sm:mb-4'>
              <h2 className='text-lg font-semibold sm:text-xl'>
                Found {ingredients.length} ingredients
              </h2>
              <span className='text-muted-foreground text-xs sm:text-sm'>
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
              <Card className='p-8 text-center'>
                <p className='text-muted-foreground'>
                  No ingredients detected. Please try uploading a clearer image.
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className='flex justify-center'>
          <Button
            size='lg'
            onClick={handleFindRecipes}
            disabled={selectedIngredients.size === 0}
            className='gap-2'
          >
            <Search className='h-5 w-5' />
            Find Recipes ({selectedIngredients.size} ingredients)
          </Button>
        </div>
      </div>
    </main>
  );
}
