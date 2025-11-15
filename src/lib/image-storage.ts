import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'recipe-images';

/**
 * base64 이미지를 File 객체로 변환
 */
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * 이미지를 Supabase Storage에 업로드
 * @param base64Image - base64 인코딩된 이미지
 * @returns 업로드된 이미지의 경로
 */
export const uploadImage = async (base64Image: string): Promise<string> => {
  try {
    // 고유한 파일명 생성 (timestamp + random)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomStr}.jpg`;

    // base64를 File로 변환
    const file = base64ToFile(base64Image, filename);

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      throw new Error(`이미지 업로드 실패: ${error.message}`);
    }

    return data.path;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    throw error;
  }
};

/**
 * Supabase Storage에서 이미지의 공개 URL 가져오기
 * @param path - 이미지 경로
 * @returns 공개 URL
 */
export const getImageUrl = (path: string): string => {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Supabase Storage에서 이미지 삭제 (선택적)
 * @param path - 삭제할 이미지 경로
 */
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      throw new Error(`이미지 삭제 실패: ${error.message}`);
    }
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    throw error;
  }
};
