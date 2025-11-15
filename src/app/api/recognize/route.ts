import { GoogleGenerativeAI } from '@google/generative-ai';

import { NextRequest, NextResponse } from 'next/server';

import { RecognizeImageRequest, RecognizeImageResponse } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `당신은 한국 음식 재료 전문가입니다. 사용자가 업로드한 냉장고나 식재료 사진을 분석하여 한식 요리에 사용할 수 있는 재료를 찾아주세요.`;

const USER_PROMPT = `이 사진에서 냉장고 또는 식재료를 분석하여 재료를 인식해주세요.

다음 JSON 형식으로만 응답하세요:
{
  "ingredients": [
    {
      "name": "재료명 (한글 또는 영문)",
      "confidence": 0.95,
      "category": "Protein"
    }
  ]
}

규칙:
- 명확히 보이는 재료만 포함하세요
- confidence는 0.0~1.0 사이의 값으로, 0.7 이상만 반환하세요
- 최대 10개까지만 반환하세요
- category는 다음 중 하나를 선택하세요: "Protein", "Vegetable", "Seasoning", "Sauce", "Grain", "Seafood"
- 재료가 명확하지 않거나 없다면 빈 배열을 반환하세요`;

interface OpenAIIngredientResponse {
  ingredients: Array<{
    name: string;
    confidence: number;
    category: string;
  }>;
}

export const POST = async (request: NextRequest) => {
  try {
    // 요청 본문 파싱
    const body: RecognizeImageRequest = await request.json();

    if (!body.imageData) {
      return NextResponse.json(
        {
          success: false,
          error: '이미지 데이터가 필요합니다',
        } as RecognizeImageResponse,
        { status: 400 },
      );
    }

    // 이미지 형식 검증
    if (!body.imageData.startsWith('data:image/')) {
      return NextResponse.json(
        {
          success: false,
          error: '잘못된 이미지 형식입니다. base64 인코딩된 이미지여야 합니다.',
        } as RecognizeImageResponse,
        { status: 400 },
      );
    }

    // Gemini Vision API 호출
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // base64 이미지 데이터를 Gemini 형식으로 변환
    const base64Data = body.imageData.split(',')[1];
    const mimeType = body.imageData.split(';')[0].split(':')[1];

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const prompt = `${SYSTEM_PROMPT}\n\n${USER_PROMPT}`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;

    // 응답 추출 및 파싱
    const aiResponse = response.text();

    if (!aiResponse) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI로부터 응답이 없습니다',
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // JSON 파싱 (마크다운 코드 블록 처리)
    let jsonResponse: OpenAIIngredientResponse;
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
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // 응답 검증 및 변환
    if (!jsonResponse.ingredients || !Array.isArray(jsonResponse.ingredients)) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI로부터 잘못된 응답 형식을 받았습니다',
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: jsonResponse.ingredients,
    } as RecognizeImageResponse);
  } catch (error) {
    console.error('재료 인식 API 오류:', error);

    // Gemini API 오류 처리
    if (error instanceof Error) {
      // Rate limit 오류 확인
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            success: false,
            error: 'API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.',
          } as RecognizeImageResponse,
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Gemini API 오류: ${error.message}`,
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // 일반 오류
    return NextResponse.json(
      {
        success: false,
        error: '재료 인식 중 오류가 발생했습니다.',
      } as RecognizeImageResponse,
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
    } as RecognizeImageResponse,
    { status: 405 },
  );
};
