import OpenAI from 'openai';

import { NextRequest, NextResponse } from 'next/server';

import { GenerateRecipesRequest, GenerateRecipesResponse, Recipe } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `당신은 전문 한식 요리사입니다. 주어진 재료로 만들 수 있는 한식 레시피를 추천해주세요.`;

const createUserPrompt = (
  ingredients: string[],
) => `다음 재료들로 만들 수 있는 한식 레시피 3개를 추천해주세요:
재료: ${ingredients.join(', ')}

각 레시피는 다음 JSON 형식으로 작성해주세요:
{
  "recipes": [
    {
      "id": "고유한 ID (예: kimchi-fried-rice-1)",
      "title": "레시피 제목",
      "description": "요리에 대한 간단한 설명 (2-3문장)",
      "image": "/placeholder-recipe.jpg",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 2,
      "difficulty": "easy",
      "ingredients": [
        { "name": "재료명", "amount": "양", "unit": "단위" }
      ],
      "instructions": [
        "조리 순서 1단계",
        "조리 순서 2단계",
        "조리 순서 3단계"
      ],
      "nutrition": {
        "calories": 300,
        "protein": 15,
        "carbs": 30,
        "fat": 10,
        "fiber": 3
      },
      "category": "Main Course",
      "cookingTools": ["프라이팬", "주걱", "칼"],
      "tags": ["빠른요리", "간단"]
    }
  ]
}

규칙:
- 주어진 재료를 주재료로 반드시 사용
- 기본 조미료(소금, 후추, 간장, 참기름 등)는 추가 가능
- difficulty는 easy, medium, hard 중 선택
- 실제로 만들 수 있는 한식 레시피만 추천
- 조리 시간은 현실적으로 설정
- 영양 정보는 1인분 기준으로 추정
- 모든 텍스트는 한국어로 작성
- JSON 형식을 정확히 지켜주세요`;

interface OpenAIRecipeResponse {
  recipes: Recipe[];
}

export const POST = async (request: NextRequest) => {
  try {
    // 요청 본문 파싱
    const body: GenerateRecipesRequest = await request.json();

    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '재료가 필요합니다',
        } as GenerateRecipesResponse,
        { status: 400 },
      );
    }

    // OpenAI Chat Completion API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: createUserPrompt(body.ingredients),
        },
      ],
      max_tokens: 4000,
      temperature: 0.7, // 창의적인 레시피 생성
    });

    // 응답 추출 및 파싱
    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI로부터 응답이 없습니다',
        } as GenerateRecipesResponse,
        { status: 500 },
      );
    }

    // JSON 파싱 (마크다운 코드 블록 처리)
    let jsonResponse: OpenAIRecipeResponse;
    try {
      // 마크다운 코드 블록 제거
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      jsonResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('AI 응답 파싱 실패:', parseError, aiResponse);
      return NextResponse.json(
        {
          success: false,
          error: 'AI 응답을 파싱하는데 실패했습니다',
        } as GenerateRecipesResponse,
        { status: 500 },
      );
    }

    // 응답 검증
    if (!jsonResponse.recipes || !Array.isArray(jsonResponse.recipes)) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI로부터 잘못된 응답 형식을 받았습니다',
        } as GenerateRecipesResponse,
        { status: 500 },
      );
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: jsonResponse.recipes,
    } as GenerateRecipesResponse);
  } catch (error) {
    console.error('레시피 생성 API 오류:', error);

    // OpenAI API 오류 처리
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: 'API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.',
          } as GenerateRecipesResponse,
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `OpenAI API 오류: ${error.message}`,
        } as GenerateRecipesResponse,
        { status: error.status || 500 },
      );
    }

    // 일반 오류
    return NextResponse.json(
      {
        success: false,
        error: '레시피 생성 중 오류가 발생했습니다.',
      } as GenerateRecipesResponse,
      { status: 500 },
    );
  }
};

// POST 메서드만 허용
export const GET = async () => {
  return NextResponse.json(
    {
      success: false,
      error: '허용되지 않는 메서드입니다. POST를 사용하세요.',
    } as GenerateRecipesResponse,
    { status: 405 },
  );
};
