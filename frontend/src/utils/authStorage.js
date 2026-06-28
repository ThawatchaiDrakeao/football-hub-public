export const getSavedUser = (storage = localStorage) => {
  try {
    const savedUser = storage.getItem("footyHubUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export const getSavedToken = (storage = localStorage) => {
  return storage.getItem("footyHubToken") || "";
};

export const saveAuthData = (authData, storage = localStorage) => {
  const { token: nextToken, ...nextUser } = authData;

  storage.setItem("footyHubToken", nextToken);
  storage.setItem("footyHubUser", JSON.stringify(nextUser));

  return { nextToken, nextUser };
};

export const clearAuthData = (storage = localStorage) => {
  storage.removeItem("footyHubUser");
  storage.removeItem("footyHubToken");
};
