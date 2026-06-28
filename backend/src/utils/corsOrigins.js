const DEFAULT_LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5177",
  "http://127.0.0.1:5177",
];

const normalizeOrigin = (origin) => {
  if (!origin) {
    return "";
  }

  return origin.trim().replace(/\/$/, "");
};

const splitOrigins = (origins = "") => {
  return origins
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
};

const getAllowedOrigins = (env = process.env) => {
  return [
    ...DEFAULT_LOCAL_ORIGINS,
    normalizeOrigin(env.FRONTEND_URL),
    ...splitOrigins(env.FRONTEND_URLS),
  ].filter(Boolean);
};

const isAllowedOrigin = (origin, allowedOrigins) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};

module.exports = {
  getAllowedOrigins,
  isAllowedOrigin,
  normalizeOrigin,
  splitOrigins,
};
