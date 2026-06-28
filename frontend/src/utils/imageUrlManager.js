export const normalizeImageUrls = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter((image) => typeof image === "string")
    .map((image) => image.trim())
    .filter(Boolean);
};

export const isValidImageUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const addImageUrl = (currentImages, value, options = {}) => {
  const { allowMultiple = true } = options;
  const imageUrl = value.trim();
  const images = normalizeImageUrls(currentImages);

  if (!imageUrl) {
    return { errorKey: "admin.emptyImageUrl", images };
  }

  if (!isValidImageUrl(imageUrl)) {
    return { errorKey: "admin.invalidImageUrl", images };
  }

  if (images.includes(imageUrl)) {
    return { errorKey: "admin.duplicateImageUrl", images };
  }

  return {
    errorKey: "",
    images: allowMultiple ? [...images, imageUrl] : [imageUrl],
  };
};

export const removeImageUrl = (currentImages, imageUrl) => {
  return normalizeImageUrls(currentImages).filter((image) => image !== imageUrl);
};
