# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

CookPT는 사용자가 냉장고의 재료 사진을 업로드하면 AI가 사진을 분석하여 재료를 인식하고, 해당 재료들로 만들 수 있는 한식 레시피를 추천하는 웹 애플리케이션입니다. Next.js 16, React 19, TypeScript, Tailwind CSS로 구축되었습니다.

## 개발 명령어

```bash
npm run dev          # Turbopack으로 개발 서버 시작
npm run build        # ESLint 실행 후 프로덕션 빌드 (Turbopack 사용)
npm start            # 프로덕션 서버 시작
npm run lint         # ESLint 실행
```

참고: 빌드 스크립트는 ESLint를 먼저 실행하며, 린트 에러가 있으면 빌드가 실패합니다.

## 아키텍처

### 페이지 플로우

사용자 여정으로 연결된 3개의 주요 페이지:

1. **홈 (/)** - [src/app/page.tsx](src/app/page.tsx)
   - `ImageUpload` 컴포넌트를 통해 냉장고의 재료 사진 업로드/촬영
   - 이미지를 base64로 localStorage에 저장하여 다음 페이지로 전달

2. **재료 인식 (/recognize)** - [src/app/recognize/page.tsx](src/app/recognize/page.tsx)
   - localStorage에서 업로드된 이미지 가져오기
   - [src/lib/ingredient-recognition.ts](src/lib/ingredient-recognition.ts)의 `recognizeIngredients()` 호출하여 AI로 재료 분석
   - 인식된 재료를 신뢰도 점수와 함께 표시
   - 사용자가 인식된 재료 선택/해제 가능
   - 선택된 재료를 URL 파라미터로 전달하여 레시피 페이지로 이동

3. **레시피 (/recipes)** - [src/app/recipes/page.tsx](src/app/recipes/page.tsx)
   - 감지된 재료로 만들 수 있는 레시피를 매칭률과 함께 표시
   - URL 쿼리 파라미터로 전달받은 재료 기반 필터링
   - 테마 카테고리로도 탐색 가능 (전자레인지 전용, 빠른 요리, 채식 등)
   - 개별 레시피 상세 페이지는 `/recipes/[id]`

### 레시피 시스템 아키텍처

레시피 시스템은 3개의 상호 연결된 부분으로 구성:

**데이터 소스**: [src/lib/recipe-data.ts](src/lib/recipe-data.ts)

- 모든 레시피 정의가 포함된 `RECIPES` 배열 내보내기
- 각 레시피에는 재료, 조리법, 영양 정보, 조리 도구, 태그, 난이도, 시간 정보 포함

**테마 필터링**: [src/lib/recipe-themes.ts](src/lib/recipe-themes.ts)

- 카테고리를 정의하는 `RECIPE_THEMES` 배열 (빠르고 쉬운 요리, 전자레인지 전용, 채식 등)
- 각 테마는 조리 시간, 필요한 도구, 태그 등의 기준으로 레시피를 필터링하는 `filterFn` 보유
- `getRecipesByTheme()`가 레시피 컬렉션에 테마 필터 적용

**재료 매칭**: [src/lib/ingredient-recognition.ts](src/lib/ingredient-recognition.ts)

- `recognizeIngredients()`는 AI가 분석한 재료를 신뢰도 점수와 함께 반환
- `findMatchingRecipes()`는 사용자의 재료와 레시피 요구사항 간의 일치 퍼센트 계산
- 일치 개수가 높은 순서로 레시피 정렬하여 반환

### 상태 관리 패턴

- UI 상태를 위한 컴포넌트 레벨 React 상태 (useState/useEffect)
- 페이지 간 데이터 지속성을 위한 localStorage (업로드된 이미지)
- 페이지 간 상태 공유를 위한 URL 쿼리 파라미터 (`/recipes?ingredients=egg,onion`)
- 전역 상태 관리 라이브러리 미사용

### 컴포넌트 구성

[src/components/](src/components/)의 애플리케이션 컴포넌트:

- `ImageUpload` - 미리보기 기능이 있는 카메라/파일 업로드
- `IngredientCard` - 신뢰도 바와 함께 인식된 재료 표시
- `RecipeCard` - 레시피 표시 카드
- `RecipeFilters` - 난이도/시간/태그 필터 UI
- `RecipeThemeSection` - 테마별 레시피 컬렉션

[src/components/ui/](src/components/ui/)의 UI 프리미티브는 Radix UI + shadcn/ui 기반.

## 코드 스타일 규칙

### Import 순서 (ESLint 강제)

[eslint.config.mjs](eslint.config.mjs)에서 설정:

1. 내장 Node 모듈
2. 외부 패키지
3. `@/` 별칭을 사용하는 내부 모듈
4. 그룹 간 빈 줄
5. 그룹 내 알파벳 순

예시:

```typescript
import { ArrowRight } from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';

import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
```

### Prettier 설정

[prettier.config.mjs](prettier.config.mjs)에서:

- 싱글 쿼트 사용 (JSX 포함)
- 100자 줄 너비
- 후행 쉼표
- Tailwind 클래스 정렬 활성화

### TypeScript 설정

- Path 별칭: `@/*`는 `src/*`로 매핑
- Strict 모드 활성화
- Target: ES6

## 환경 설정

`.env.example`을 `.env.local`로 복사:

- `OPENAI_API_KEY` - AI 기반 재료 인식에 사용

## 모바일 반응형

[src/lib/responsive.ts](src/lib/responsive.ts)의 유틸리티 함수:

- `isMobile(breakpoint?)` - 뷰포트 너비 확인 (기본값 768px 임계값)
- `getScreenWidth()` - 현재 뷰포트 너비 반환

스타일링에는 Tailwind 반응형 클래스 (`sm:`, `md:`, `lg:`) 사용 권장.

## 주요 기능

1. **이미지 기반 재료 인식**: 사용자가 업로드한 냉장고 사진에서 AI가 자동으로 재료 감지
2. **스마트 레시피 추천**: 감지된 재료를 기반으로 만들 수 있는 한식 레시피 추천
3. **테마별 탐색**: 조리 시간, 난이도, 조리 도구별로 레시피 탐색 가능
4. **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험
