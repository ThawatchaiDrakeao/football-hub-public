let guardsInstalled = false;

const getErrorText = (error) => {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  return [
    error.message,
    error.stack,
    error.code,
    error.hostname,
    error.cause?.message,
    error.cause?.stack,
  ]
    .filter(Boolean)
    .join(" ");
};

const isOptionalSupabaseError = (error) => {
  const errorText = getErrorText(error).toLowerCase();

  return errorText.includes("supabase") || errorText.includes("supabase.co");
};

const logOptionalSupabaseWarning = (error) => {
  const errorCode = error?.code ? ` (${error.code})` : "";

  console.warn(
    `Optional Supabase startup check failed${errorCode}; continuing because MongoDB is the primary database.`
  );
};

const installOptionalStartupGuards = () => {
  if (guardsInstalled) {
    return;
  }

  guardsInstalled = true;

  process.on("unhandledRejection", (reason) => {
    if (isOptionalSupabaseError(reason)) {
      logOptionalSupabaseWarning(reason);
      return;
    }

    throw reason;
  });

  process.on("uncaughtException", (error) => {
    if (isOptionalSupabaseError(error)) {
      logOptionalSupabaseWarning(error);
      return;
    }

    console.error(error);
    process.exit(1);
  });
};

module.exports = {
  getErrorText,
  installOptionalStartupGuards,
  isOptionalSupabaseError,
};
