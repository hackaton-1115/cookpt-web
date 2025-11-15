import { GoogleGenerativeAI } from '@google/generative-ai';

import { NextRequest, NextResponse } from 'next/server';

import { GenerateRecipesRequest, GenerateRecipesResponse, Recipe } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
        "재료 준비: 모든 재료를 깨끗이 씻고, 필요한 크기로 손질합니다. 예를 들어, 양파는 0.5cm 두께로 채썰고, 마늘은 편으로 썰어주세요.",
        "양념 만들기: 볼에 간장 2스푼, 설탕 1스푼, 참기름 1스푼을 넣고 잘 섞어 양념장을 만듭니다.",
        "중불로 예열: 프라이팬을 중불로 2-3분간 예열한 후 식용유를 두르고 마늘을 넣어 30초간 볶아 향을 냅니다.",
        "주재료 볶기: 준비한 주재료를 넣고 중강불에서 5분간 볶습니다. 재료가 반쯤 익으면 준비한 양념장을 넣습니다.",
        "마무리: 양념이 고루 배도록 2-3분 더 볶은 후 참깨를 뿌려 완성합니다. 불을 끄고 1분 정도 뜸을 들이면 더욱 맛있습니다."
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
- JSON 형식을 정확히 지켜주세요

조리법(instructions) 작성 가이드:
- 각 단계는 구체적이고 상세하게 작성 (최소 5-7단계)
- 불의 세기(약불, 중불, 강불), 조리 시간(분/초), 재료의 크기(cm, mm) 등을 명확히 표기
- 초보자도 따라할 수 있도록 "왜" 그 과정이 필요한지 간단히 설명 추가
- 재료 손질 → 양념 만들기 → 조리 → 마무리 순서로 논리적 흐름 유지
- 각 단계마다 예상되는 상태 변화(색깔, 질감, 향 등)를 설명`;

interface GeminiRecipeResponse {
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

    // Gemini API 호출
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `${SYSTEM_PROMPT}\n\n${createUserPrompt(body.ingredients)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // 응답 추출 및 파싱
    const aiResponse = response.text();

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
    let jsonResponse: GeminiRecipeResponse;
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

    // Gemini API 오류 처리
    if (error instanceof Error) {
      // Rate limit 오류 확인
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
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
          error: `Gemini API 오류: ${error.message}`,
        } as GenerateRecipesResponse,
        { status: 500 },
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
