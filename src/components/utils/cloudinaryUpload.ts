import { validateImage, resizeImage } from './imageUtils';

export const CLOUDINARY_CLOUD_NAME = "dhtccddbk";
export const CLOUDINARY_UPLOAD_PRESET = "wearaura_uploads";
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // 1. Validate
  validateImage(file);

  // 2. Resize & compress
  const compressedBlob = await resizeImage(file);

  // 3. Build FormData
  const formData = new FormData();
  formData.append('file', compressedBlob, file.name);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  // 4. POST to Cloudinary
  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const rawText = await response.text();
    let errorData: any = {};
    try { errorData = JSON.parse(rawText); } catch {}
    console.error(`Cloudinary upload failed [${response.status}]:`, rawText);
    throw new Error(errorData?.error?.message || `Upload failed (${response.status}). Check Cloudinary preset name.`);
  }

  const data = await response.json();

  // 5. Return the secure URL
  return data.secure_url; // "https://res.cloudinary.com/dhtccddbk/image/upload/..."
};
