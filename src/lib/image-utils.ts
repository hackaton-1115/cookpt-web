/**
 * Image utility functions for compression and validation
 */

const MAX_IMAGE_SIZE_MB = 5;
const JPEG_QUALITY = 0.8;

/**
 * Validates if the base64 string is a valid image format
 */
export function validateImageFormat(base64: string): boolean {
  const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
  return validFormats.some((format) => base64.startsWith(`data:${format}`));
}

/**
 * Gets the size of a base64 encoded image in MB
 */
function getBase64SizeInMB(base64: string): number {
  const stringLength = base64.length - 'data:image/png;base64,'.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  return sizeInBytes / (1024 * 1024);
}

/**
 * Compresses an image if it exceeds the maximum size
 * @param base64 - Base64 encoded image string
 * @param maxSizeMB - Maximum allowed size in MB
 * @returns Compressed base64 image string
 */
export async function compressImage(
  base64: string,
  maxSizeMB: number = MAX_IMAGE_SIZE_MB,
): Promise<string> {
  // Check if compression is needed
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
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions (maintain aspect ratio)
      let width = img.width;
      let height = img.height;
      const scaleFactor = Math.sqrt(maxSizeMB / currentSize);

      width = Math.floor(width * scaleFactor);
      height = Math.floor(height * scaleFactor);

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG for better compression
      const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

      // Verify compression worked
      const newSize = getBase64SizeInMB(compressed);
      if (newSize <= maxSizeMB) {
        resolve(compressed);
      } else {
        // If still too large, try with lower quality
        const veryCompressed = canvas.toDataURL('image/jpeg', 0.6);
        resolve(veryCompressed);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = base64;
  });
}

/**
 * Validates and optionally compresses an image
 * @param base64 - Base64 encoded image string
 * @returns Validated and compressed image or throws error
 */
export async function validateAndCompressImage(base64: string): Promise<string> {
  if (!validateImageFormat(base64)) {
    throw new Error('Invalid image format. Please use JPEG, PNG, or WEBP.');
  }

  const size = getBase64SizeInMB(base64);
  if (size > 20) {
    throw new Error('Image is too large. Maximum size is 20MB.');
  }

  return compressImage(base64);
}
