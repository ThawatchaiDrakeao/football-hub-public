export const passwordMinLength = 8;

export const isPasswordLongEnough = (password) => {
  return String(password || "").length >= passwordMinLength;
};

export const getPasswordLengthError = () => {
  return `Password must be at least ${passwordMinLength} characters.`;
};
