// src/utils/imageCompression.js
export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

/**
 * compressImage(file, maxSizeKB = 500)
 * Accepts a File/Blob and returns { base64, size, thumb } where base64 is JPEG base64.
 */
export async function compressImage(file, maxSizeKB = 500) {
  if (!file) {
    throw new Error('No file provided');
  }

  // Read first (safer than relying on file.type which may be undefined)
  const dataUrl = await readFileAsDataURL(file);

  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    throw new Error('Not an image file');
  }

  // Create an image out of the data URL
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  // Start with a reasonable max dimension to reduce size early
  const MAX_DIM = 2048;
  let { width, height } = img;
  let scale = 1;
  if (width > MAX_DIM || height > MAX_DIM) {
    scale = Math.min(MAX_DIM / width, MAX_DIM / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // helper to get dataURL from current canvas with given quality
  const canvasToDataURL = (quality) => canvas.toDataURL('image/jpeg', quality);

  // initial draw
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // compute size helper
  const sizeFromDataUrl = (durl) => {
    // approximate bytes from base64 length
    const base64Length = durl.length - durl.indexOf(',') - 1;
    return Math.round((base64Length * 3) / 4);
  };

  // Try reducing quality progressively
  let quality = 0.92;
  let base64 = canvasToDataURL(quality);
  let bytes = sizeFromDataUrl(base64);
  const MIN_QUALITY = 0.45;

  while (bytes > maxSizeKB * 1024 && quality > MIN_QUALITY) {
    quality -= 0.08;
    base64 = canvasToDataURL(quality);
    bytes = sizeFromDataUrl(base64);
  }

  // If still too big, scale down dimensions and try again (loop until reasonable)
  let currentScale = scale;
  while (bytes > maxSizeKB * 1024 && (canvas.width > 400 || canvas.height > 400)) {
    currentScale *= 0.85;
    const newW = Math.max(200, Math.round(img.width * currentScale));
    const newH = Math.max(200, Math.round(img.height * currentScale));
    canvas.width = newW;
    canvas.height = newH;
    ctx.drawImage(img, 0, 0, newW, newH);

    quality = 0.92;
    base64 = canvasToDataURL(quality);
    bytes = sizeFromDataUrl(base64);

    while (bytes > maxSizeKB * 1024 && quality > MIN_QUALITY) {
      quality -= 0.08;
      base64 = canvasToDataURL(quality);
      bytes = sizeFromDataUrl(base64);
    }
  }

  // Create a small thumbnail (120px width)
  const thumbCanvas = document.createElement('canvas');
  const thumbW = 120;
  const thumbH = Math.max(40, Math.round((img.height / img.width) * thumbW));
  thumbCanvas.width = thumbW;
  thumbCanvas.height = thumbH;
  const tctx = thumbCanvas.getContext('2d');
  tctx.drawImage(img, 0, 0, thumbW, thumbH);
  const thumb = thumbCanvas.toDataURL('image/jpeg', 0.7);

  return {
    base64,
    size: bytes,
    thumb,
  };
}
