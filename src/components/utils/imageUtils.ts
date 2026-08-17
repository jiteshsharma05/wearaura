// Allowed formats
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validate image before upload
export const validateImage = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are allowed.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be under 5MB.');
  }
  return true;
};

// Resize image using canvas (maintains aspect ratio)
export const resizeImage = (file: File, maxWidth = 1200, maxHeight = 1200): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = reject;

    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and convert to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          },
          'image/jpeg',
          0.85 // quality: 85%
        );
      } else {
        reject(new Error('Could not get Canvas 2D context'));
      }
    };
    img.onerror = reject;

    reader.readAsDataURL(file);
  });
};
