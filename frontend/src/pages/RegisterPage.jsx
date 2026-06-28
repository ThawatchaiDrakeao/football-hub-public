import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  isPasswordLongEnough,
  passwordMinLength,
} from "../utils/passwordValidation.js";
import PageShell from "./PageShell.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const { t } = useLanguage();
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormError("");
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordLongEnough(formData.password)) {
      setFormError(t("auth.passwordMinLength"));
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/profile", { replace: true });
    } catch {
      // AuthContext already stores the error message for the page to display.
    }
  };

  return (
    <PageShell
      title={t("auth.registerTitle")}
      description={t("auth.registerDescription")}
    >
      <form onSubmit={handleSubmit} className="grid max-w-md gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          {t("auth.name")}
          <input
            className="rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-lime"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("auth.namePlaceholder")}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          {t("auth.email")}
          <input
            className="rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-lime"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("auth.emailPlaceholder")}
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-200">
          {t("auth.password")}
          <div className="flex overflow-hidden rounded-md border border-white/10 bg-black/30 transition focus-within:border-lime">
            <input
              autoComplete="new-password"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white outline-none"
              minLength={passwordMinLength}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("auth.passwordMinPlaceholder")}
              required
            />
            <button
              aria-label={
                showPassword ? t("auth.hidePassword") : t("auth.showPassword")
              }
              className="border-l border-white/10 px-3 text-sm font-black text-lime transition hover:bg-lime hover:text-pitch"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? t("auth.hide") : t("auth.show")}
            </button>
          </div>
        </label>

        {formError || error ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {formError || error}
          </p>
        ) : null}

        <button
          className="rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-lime/90 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? t("auth.creatingAccount") : t("nav.register")}
        </button>
      </form>
    </PageShell>
  );
};

export default RegisterPage;
