import OpenAI from 'openai';

import { NextRequest, NextResponse } from 'next/server';

import { RecognizeImageRequest, RecognizeImageResponse } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RecognizeImageRequest = await request.json();

    if (!body.imageData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image data is required',
        } as RecognizeImageResponse,
        { status: 400 },
      );
    }

    // Validate image format
    if (!body.imageData.startsWith('data:image/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image format. Must be a base64 encoded image.',
        } as RecognizeImageResponse,
        { status: 400 },
      );
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: USER_PROMPT,
            },
            {
              type: 'image_url',
              image_url: {
                url: body.imageData,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent results
    });

    // Extract and parse the response
    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        {
          success: false,
          error: 'No response from AI',
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonResponse: OpenAIIngredientResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      jsonResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, aiResponse);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response',
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // Validate and transform the response
    if (!jsonResponse.ingredients || !Array.isArray(jsonResponse.ingredients)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response format from AI',
        } as RecognizeImageResponse,
        { status: 500 },
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: jsonResponse.ingredients,
    } as RecognizeImageResponse);
  } catch (error) {
    console.error('Error in recognize API:', error);

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
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
          error: `OpenAI API 오류: ${error.message}`,
        } as RecognizeImageResponse,
        { status: error.status || 500 },
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: '재료 인식 중 오류가 발생했습니다.',
      } as RecognizeImageResponse,
      { status: 500 },
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST.',
    } as RecognizeImageResponse,
    { status: 405 },
  );
}
