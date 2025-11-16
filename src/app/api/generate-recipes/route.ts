import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenAI } from '@google/genai'; // 개발 중 이미지 생성 비활성화

import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { GenerateRecipesRequest, Ingredient, NutritionInfo } from '@/lib/types';

// AI가 생성하는 원시 레시피 타입 (camelCase)
interface AIGeneratedRecipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  cookingTools: string[];
  tags: string[];
  nutrition: NutritionInfo;
}

// 이미지 생성 에러 타입
interface ImageGenerationError {
  recipe: string;
  error: string;
}

// 저장된 레시피 응답 타입 (Recipe 타입과 일치)
interface SavedRecipeResponse {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number; // cookingTime 대신 cookTime 사용
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  category: string;
  cookingTools: string[];
  tags: string[];
  likesCount: number;
}

// 프롬프트 생성 함수
const buildRecipePrompt = (params: {
  ingredients: string[];
  theme?: string;
  cuisine?: string;
  tools?: string[];
}): string => {
  const { ingredients, theme, cuisine, tools } = params;
  let prompt =
    '당신은 전문 요리 레시피 작성가입니다. 다음 조건에 맞는 레시피를 최대 9개까지 작성해주세요.\n⚠️ 중요: 모든 레시피는 반드시 한국어로 작성해야 합니다.\n\n';

  // 재료 목록
  prompt += '### 사용 가능한 재료\n';
  prompt += ingredients.join(', ') + '\n\n';

  // 음식 국적
  if (cuisine) {
    const cuisineMap: Record<string, string> = {
      korean: '한국 요리',
      japanese: '일본 요리',
      chinese: '중국 요리',
      western: '양식',
      thai: '태국 요리',
      vietnamese: '베트남 요리',
    };
    prompt += '### 음식 국적\n';
    prompt += (cuisineMap[cuisine] || cuisine) + '\n\n';
  } else {
    prompt += '### 음식 국적\n한국 요리 (기본값)\n\n';
  }

  // 레시피 스타일
  if (theme) {
    const themeMap: Record<string, string> = {
      quick: '빠른 요리 (총 15분 이내, 준비 5분 + 조리 10분)',
      microwave: '전자레인지 전용 (전자레인지만 사용)',
      easy: '초보자용 (난이도: easy, 간단한 조리법)',
      healthy: '건강식 (저칼로리, 영양 균형)',
      spicy: '매운 요리 (고추, 고추장 등 사용)',
      soup: '국/찌개/탕 종류',
      'one-bowl': '한 그릇 요리 (덮밥, 비빔밥 등)',
      simple: '간단 요리 (조리 과정 3단계 이하)',
    };
    prompt += '### 레시피 스타일\n';
    prompt += (themeMap[theme] || theme) + '\n';
    prompt += '⚠️ 이 조건을 반드시 만족해야 합니다.\n\n';
  }

  // 조리 도구 제약
  if (tools && tools.length > 0) {
    const toolMap: Record<string, string> = {
      pan: '프라이팬',
      pot: '냄비',
      microwave: '전자레인지',
      oven: '오븐',
      airfryer: '에어프라이어',
      ricecooker: '전기밥솥',
      blender: '믹서기',
    };
    const toolNames = tools.map((t) => toolMap[t] || t).join(', ');
    prompt += '### 사용 가능한 조리 도구\n';
    prompt += toolNames + '\n';
    prompt += '⚠️ 위 도구만 사용하는 레시피를 작성해주세요. 다른 도구는 절대 사용하지 마세요.\n\n';
  }

  // 출력 형식 예시
  prompt += '### 출력 형식\n';
  prompt +=
    '다음 JSON 배열 형식으로 레시피를 작성해주세요. 최소 3개, 최대 9개까지 작성 가능합니다:\n\n';
  prompt += '[\n';
  prompt += '  {\n';
  prompt += '    "title": "김치볶음밥",\n';
  prompt += '    "description": "남은 밥과 김치로 5분 만에 만드는 간단한 한 끼",\n';
  prompt += '    "ingredients": [\n';
  prompt += '      {"name": "밥", "amount": "2", "unit": "공기"},\n';
  prompt += '      {"name": "배추김치", "amount": "150", "unit": "g"},\n';
  prompt += '      {"name": "대파", "amount": "1/2", "unit": "대"},\n';
  prompt += '      {"name": "양파", "amount": "1/4", "unit": "개"},\n';
  prompt += '      {"name": "식용유", "amount": "2", "unit": "큰술"},\n';
  prompt += '      {"name": "참기름", "amount": "1", "unit": "작은술"},\n';
  prompt += '      {"name": "김치국물", "amount": "2", "unit": "큰술"},\n';
  prompt += '      {"name": "간장", "amount": "1/2", "unit": "큰술"},\n';
  prompt += '      {"name": "참깨", "amount": "약간", "unit": ""},\n';
  prompt += '      {"name": "김가루", "amount": "약간", "unit": ""}\n';
  prompt += '    ],\n';
  prompt += '    "instructions": [\n';
  prompt +=
    '      "1. 준비: 김치는 송송 잘게 썰어주세요. 김치의 물기는 가볍게 짜서 제거해주세요.",\n';
  prompt +=
    '      "2. 볶기: 프라이팬에 식용유를 두르고 중불로 예열한 후, 김치를 먼저 넣고 2-3분간 볶아 김치의 신맛을 날려주세요.",\n';
  prompt +=
    '      "3. 밥 넣기: 볶은 김치 위에 밥을 넣고 주걱으로 밥알이 으깨지지 않도록 부드럽게 섞으며 3-4분간 볶아주세요.",\n';
  prompt +=
    '      "4. 마무리: 불을 끄고 참기름을 둘러 한 번 더 섞어주세요. 기호에 따라 김가루나 참깨를 뿌려 완성합니다."\n';
  prompt += '    ],\n';
  prompt += '    "cookingTime": 5,\n';
  prompt += '    "prepTime": 3,\n';
  prompt += '    "servings": 1,\n';
  prompt += '    "difficulty": "easy",\n';
  prompt += '    "category": "Main Course",\n';
  prompt += '    "cookingTools": ["프라이팬", "주걱"],\n';
  prompt += '    "tags": ["빠른요리", "한식", "볶음밥"],\n';
  prompt +=
    '    "nutrition": {"calories": 350, "protein": 8, "carbs": 55, "fat": 10, "fiber": 3}\n';
  prompt += '  }\n';
  prompt += ']\n\n';

  // 제약사항
  prompt += '### 주의사항\n';
  prompt +=
    '1. 반드시 위에 제시된 재료만 사용하세요. 추가 재료는 기본 조미료(소금, 후추, 식용유, 간장, 참기름 등)만 허용됩니다.\n';
  prompt += '2. cookingTime, prepTime은 분 단위 숫자로 작성하세요.\n';
  prompt += '3. difficulty는 "easy", "medium", "hard" 중 하나만 사용하세요.\n';
  prompt += '4. cookingTools는 실제로 사용하는 도구만 정확히 나열하세요.\n';
  prompt += '5. 영양 정보는 1인분 기준으로 계산해주세요.\n';
  prompt += '6. JSON 배열만 반환하고, 다른 설명이나 텍스트는 포함하지 마세요.\n';
  prompt +=
    '7. 레시피는 최소 3개, 최대 9개까지 작성하세요. 조건이 제한적이면 3개만 작성해도 됩니다.\n';
  prompt += '8. 각 레시피는 서로 다른 요리여야 합니다. 비슷한 레시피를 반복하지 마세요.\n';
  prompt +=
    '9. 모든 필드(title, description, instructions 등)는 반드시 한국어로 작성해야 합니다.\n';
  prompt += '\n';
  prompt += '### 재료(ingredients) 작성 가이드\n';
  prompt +=
    '⚠️ 매우 중요: 재료는 초보자도 정확히 계량할 수 있도록 매우 구체적이고 상세하게 작성해야 합니다.\n';
  prompt += '각 재료는 다음 원칙을 따라주세요:\n';
  prompt +=
    '- 재료명은 구체적으로 작성하세요 (예: "김치" 대신 "배추김치", "고추" 대신 "청양고추").\n';
  prompt +=
    '- 계량 단위를 정확히 명시하세요 (예: "큰술", "작은술", "g", "ml", "개", "대", "컵", "공기").\n';
  prompt += '- 분수 표현을 사용하세요 (예: "1/2", "1/3", "1/4").\n';
  prompt +=
    '- 소량의 재료는 "약간"으로 표시하되, 가능하면 구체적인 양을 제시하세요 (예: "참깨 약간" 또는 "참깨 1작은술").\n';
  prompt += '- 필수 재료와 선택 재료를 모두 포함하세요 (예: 토핑, 가니쉬도 재료 목록에 포함).\n';
  prompt +=
    '- 조미료와 양념은 빠짐없이 나열하세요 (예: 소금, 설탕, 간장, 고추장, 참기름, 식용유 등).\n';
  prompt += '- 부재료도 상세히 작성하세요 (예: "물 600ml", "육수 2컵", "다진 마늘 1/2큰술").\n';
  prompt += '- 재료는 조리 순서대로 배열하되, 주재료 → 부재료 → 양념 순으로 정리하세요.\n';
  prompt += '- 최소 8-12개 이상의 재료로 구성하여 완성도 있는 레시피를 작성하세요.\n';
  prompt += '\n';
  prompt += '### 조리법(instructions) 작성 가이드\n';
  prompt +=
    '⚠️ 매우 중요: 조리법은 초보자도 따라할 수 있도록 매우 상세하고 구체적으로 작성해야 합니다.\n';
  prompt += '각 단계는 다음 형식을 따라주세요:\n';
  prompt += '- 각 단계 앞에 "1. 준비:", "2. 볶기:", "3. 조리:" 등의 번호와 단계명을 붙여주세요.\n';
  prompt +=
    '- 재료의 구체적인 손질 방법을 명시하세요 (예: "잘게 썰기", "송송 썰기", "한입 크기로 자르기").\n';
  prompt +=
    '- 조리 도구와 불 세기를 명확히 표시하세요 (예: "중불로 예열", "약불에서 5분간 끓이기").\n';
  prompt +=
    '- 시간과 상태를 구체적으로 설명하세요 (예: "2-3분간 볶아 김치의 신맛을 날려주세요", "노릇해질 때까지 굽기").\n';
  prompt +=
    '- 조리 중 주의사항이나 팁을 포함하세요 (예: "밥알이 으깨지지 않도록 부드럽게 섞기", "물이 끓어넘치지 않도록 주의").\n';
  prompt += '- 최소 4-6단계 이상으로 작성하여 초보자도 쉽게 따라할 수 있도록 하세요.\n';
  prompt +=
    '- 마무리 단계에서는 완성 기준과 선택적 토핑/가니쉬를 안내하세요 (예: "김가루나 참깨를 뿌려 완성").\n';

  return prompt;
};

export const POST = async (req: NextRequest) => {
  try {
    const body: GenerateRecipesRequest = await req.json();
    const { ingredients, theme, cuisine, tools } = body;

    // 유효성 검사
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { success: false, error: '재료를 최소 1개 이상 입력해주세요.' },
        { status: 400 },
      );
    }

    // 조건 충돌 감지
    if (tools && tools.length > 0 && theme === 'microwave' && !tools.includes('microwave')) {
      return NextResponse.json(
        {
          success: false,
          error: '전자레인지 테마를 선택했지만 조리 도구에 전자레인지가 없습니다.',
        },
        { status: 400 },
      );
    }

    // API 키 확인
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY not configured' },
        { status: 500 },
      );
    }

    // Gemini Text API
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const textModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    // Imagen API (개발 중에는 비활성화)
    // const imageAI = new GoogleGenAI({
    //   apiKey: geminiApiKey,
    // });

    // 1. 동적 프롬프트 생성
    const recipePrompt = buildRecipePrompt({ ingredients, theme, cuisine, tools });
    console.log('Generated prompt:', recipePrompt);

    // 2. Gemini로 레시피 생성
    const recipeResult = await textModel.generateContent(recipePrompt);
    const recipeResponse = await recipeResult.response;
    const recipeText = recipeResponse.text();

    let recipes: AIGeneratedRecipe[];
    try {
      const jsonText = recipeText.replace(/```json\n?|```/g, '').trim();
      recipes = JSON.parse(jsonText) as AIGeneratedRecipe[];
    } catch {
      console.error('Failed to parse recipe JSON:', recipeText);
      return NextResponse.json(
        {
          success: false,
          error: 'AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.',
          rawResponse: recipeText,
        },
        { status: 500 },
      );
    }

    // 응답 검증
    if (!Array.isArray(recipes)) {
      return NextResponse.json(
        { success: false, error: 'AI 응답이 배열 형식이 아닙니다.' },
        { status: 500 },
      );
    }

    if (recipes.length === 0) {
      return NextResponse.json(
        { success: false, error: '조건에 맞는 레시피를 생성할 수 없습니다. 조건을 완화해보세요.' },
        { status: 200 },
      );
    }

    // 최대 9개로 제한
    const limitedRecipes = recipes.slice(0, 9);
    console.log(`Generated ${limitedRecipes.length} recipes`);

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // 사용자 ID 가져오기 (옵션)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // 3. 각 레시피에 대해 이미지 생성 및 저장
    const savedRecipes: SavedRecipeResponse[] = [];
    const imageErrors: ImageGenerationError[] = [];

    for (const recipe of limitedRecipes) {
      // 고유한 ID 생성
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const recipeId = `${recipe.title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-')}-${timestamp}-${randomSuffix}`;

      // 개발 중에는 placeholder 이미지만 사용
      const imageUrl = '/placeholder-recipe.jpg';
      console.log(`Using placeholder image for: ${recipe.title}`);

      // TODO: 프로덕션에서는 이미지 생성 활성화
      // try {
      //   console.log(`Generating image for: ${recipe.title}`);
      //
      //   const cuisineNames: Record<string, string> = {
      //     korean: 'Korean',
      //     japanese: 'Japanese',
      //     chinese: 'Chinese',
      //     western: 'Western',
      //     thai: 'Thai',
      //     vietnamese: 'Vietnamese',
      //   };
      //   const cuisineName = cuisine ? cuisineNames[cuisine] || 'Korean' : 'Korean';
      //   const imagePrompt = `A professional, appetizing photo of ${cuisineName} food dish: ${recipe.title}. ${recipe.description}. The dish should be beautifully plated on a traditional dish, with natural lighting, high quality food photography style, realistic, delicious looking.`;
      //
      //   const imageResponse = await imageAI.models.generateImages({
      //     model: 'imagen-4.0-generate-001',
      //     prompt: imagePrompt,
      //     config: {
      //       numberOfImages: 1,
      //     },
      //   });
      //
      //   console.log('Image generated successfully');
      //
      //   if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      //     const firstImage = imageResponse.generatedImages[0];
      //     if (firstImage?.image?.imageBytes) {
      //       const imageBytes = firstImage.image.imageBytes;
      //       const binaryString = atob(imageBytes);
      //       const bytes = new Uint8Array(binaryString.length);
      //       for (let i = 0; i < binaryString.length; i++) {
      //         bytes[i] = binaryString.charCodeAt(i);
      //       }
      //
      //       const { error: uploadError } = await supabase.storage
      //         .from('recipe-images')
      //         .upload(storageFileName, bytes, {
      //           contentType: 'image/png',
      //           upsert: false,
      //         });
      //
      //       if (!uploadError) {
      //         const {
      //           data: { publicUrl },
      //         } = supabase.storage.from('recipe-images').getPublicUrl(storageFileName);
      //         imageUrl = publicUrl;
      //         console.log('Image uploaded successfully:', imageUrl);
      //       } else {
      //         console.error('Image upload error:', uploadError);
      //         imageErrors.push({
      //           recipe: recipe.title,
      //           error: 'Upload failed: ' + uploadError.message,
      //         });
      //       }
      //     } else {
      //       imageErrors.push({ recipe: recipe.title, error: 'No image bytes' });
      //     }
      //   } else {
      //     imageErrors.push({ recipe: recipe.title, error: 'No generated images' });
      //   }
      // } catch (imageError) {
      //   console.error('Image generation error for', recipe.title, ':', imageError);
      //   imageErrors.push({
      //     recipe: recipe.title,
      //     error: imageError instanceof Error ? imageError.message : 'Unknown error',
      //   });
      // }

      // 4. Supabase DB에 레시피 저장
      try {
        // Json 타입 호환성을 위해 JSON 직렬화/역직렬화
        const recipeData = {
          id: recipeId,
          title: recipe.title,
          description: recipe.description,
          image_url: imageUrl,
          prep_time: recipe.prepTime || 10,
          cook_time: recipe.cookingTime || 20,
          servings: recipe.servings || 2,
          difficulty: recipe.difficulty || 'medium',
          category: recipe.category || 'Main Course',
          ingredients: JSON.parse(JSON.stringify(recipe.ingredients || [])),
          instructions: recipe.instructions || [],
          nutrition: JSON.parse(
            JSON.stringify(
              recipe.nutrition || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
              },
            ),
          ),
          cooking_tools: recipe.cookingTools || [],
          tags: recipe.tags || [],
          user_id: userId,
        };

        const { error } = await supabase.from('recipes').insert(recipeData);

        if (error) {
          console.error('Failed to save recipe:', error);
        } else {
          savedRecipes.push({
            id: recipeId,
            title: recipe.title,
            description: recipe.description,
            image: imageUrl,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookingTime, // cookingTime → cookTime 매핑
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            nutrition: recipe.nutrition,
            category: recipe.category,
            cookingTools: recipe.cookingTools,
            tags: recipe.tags,
            likesCount: 0,
          });
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: savedRecipes,
      imageErrors: imageErrors.length > 0 ? imageErrors : undefined,
    });
  } catch (error) {
    console.error('Error:', error);

    let errorMessage = '레시피 생성 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      if (error.message?.includes('timeout') || error.message?.includes('시간 초과')) {
        errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      } else if (error.message?.includes('API key')) {
        errorMessage = 'API 키가 유효하지 않습니다.';
      } else if (error.message?.includes('quota')) {
        errorMessage = 'API 사용량이 초과되었습니다.';
      }
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
};
