/**
 * 이미지 압축 및 검증 유틸리티 함수
 */

const MAX_IMAGE_SIZE_MB = 5;
const JPEG_QUALITY = 0.8;

/**
 * base64 문자열이 유효한 이미지 형식인지 검증
 */
export const validateImageFormat = (base64: string): boolean => {
  const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
  return validFormats.some((format) => base64.startsWith(`data:${format}`));
};

/**
 * base64 인코딩된 이미지의 크기를 MB 단위로 계산
 */
const getBase64SizeInMB = (base64: string): number => {
  const stringLength = base64.length - 'data:image/png;base64,'.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  return sizeInBytes / (1024 * 1024);
};

/**
 * 최대 크기를 초과하는 경우 이미지를 압축
 * @param base64 - Base64 인코딩된 이미지 문자열
 * @param maxSizeMB - 최대 허용 크기 (MB)
 * @returns 압축된 base64 이미지 문자열
 */
export const compressImage = async (
  base64: string,
  maxSizeMB: number = MAX_IMAGE_SIZE_MB,
): Promise<string> => {
  // 압축이 필요한지 확인
  const currentSize = getBase64SizeInMB(base64);
  if (currentSize <= maxSizeMB) {
    return base64;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('캔버스 컨텍스트를 가져오는데 실패했습니다'));
        return;
      }

      // 새로운 크기 계산 (가로세로 비율 유지)
      let width = img.width;
      let height = img.height;
      const scaleFactor = Math.sqrt(maxSizeMB / currentSize);

      width = Math.floor(width * scaleFactor);
      height = Math.floor(height * scaleFactor);

      canvas.width = width;
      canvas.height = height;

      // 그리기 및 압축
      ctx.drawImage(img, 0, 0, width, height);

      // 더 나은 압축을 위해 JPEG로 변환
      const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

      // 압축이 제대로 되었는지 확인
      const newSize = getBase64SizeInMB(compressed);
      if (newSize <= maxSizeMB) {
        resolve(compressed);
      } else {
        // 여전히 너무 크면 더 낮은 품질로 시도
        const veryCompressed = canvas.toDataURL('image/jpeg', 0.6);
        resolve(veryCompressed);
      }
    };

    img.onerror = () => {
      reject(new Error('이미지 압축을 위한 로드에 실패했습니다'));
    };

    img.src = base64;
  });
};

/**
 * 이미지 검증 및 필요시 압축
 * @param base64 - Base64 인코딩된 이미지 문자열
 * @returns 검증 및 압축된 이미지 또는 에러 발생
 */
export const validateAndCompressImage = async (base64: string): Promise<string> => {
  if (!validateImageFormat(base64)) {
    throw new Error('잘못된 이미지 형식입니다. JPEG, PNG 또는 WEBP를 사용하세요.');
  }

  const size = getBase64SizeInMB(base64);
  if (size > 20) {
    throw new Error('이미지가 너무 큽니다. 최대 크기는 20MB입니다.');
  }

  return compressImage(base64);
};
