import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const navLinks = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.products", to: "/products" },
  { labelKey: "nav.fields", to: "/fields" },
  { labelKey: "nav.community", to: "/community" },
];

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  const authLinks = isAuthenticated
    ? [
        { labelKey: "nav.profile", to: "/profile" },
        ...(user?.role === "admin"
          ? [{ labelKey: "nav.admin", to: "/admin" }]
          : []),
      ]
    : [
        { labelKey: "nav.login", to: "/login" },
        { labelKey: "nav.register", to: "/register" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pitch/95 shadow-lg shadow-black/25 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <NavLink to="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-lime/60 bg-lime/10 text-lg font-black text-lime shadow-[0_0_24px_rgba(217,255,0,0.22)]">
            FH
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-[0.18em] text-white">
              FOOTBALL HUB
            </p>
            <p className="truncate text-xs font-medium text-slate-400">
              {t("brand.tagline")}
            </p>
          </div>
        </NavLink>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end lg:gap-3">
          {[...navLinks, ...authLinks].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-bold transition",
                  isActive
                    ? "bg-lime text-pitch shadow-md shadow-lime/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-lime",
                ].join(" ")
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              [
                "inline-flex min-h-11 items-center rounded-md border px-3 py-2 text-sm font-bold transition",
                isActive
                  ? "border-lime bg-lime text-pitch shadow-md shadow-lime/20"
                  : "border-field/50 bg-field/10 text-slate-200 hover:border-lime hover:text-lime",
              ].join(" ")
            }
          >
            {t("nav.cart")}
            {cartCount > 0 ? ` (${cartCount})` : ""}
          </NavLink>
          <button
            aria-label={t("nav.language")}
            className="flex min-h-11 rounded-md border border-lime/40 bg-field/10 p-1 shadow-[0_0_18px_rgba(217,255,0,0.12)] transition hover:border-lime"
            onClick={toggleLanguage}
            title={t("nav.toggleLanguage")}
            type="button"
          >
            {["th", "en"].map((languageOption) => (
              <span
                className={[
                  "rounded px-2 py-1 text-xs font-black uppercase transition",
                  language === languageOption
                    ? "bg-lime text-pitch shadow-md shadow-lime/20"
                    : "text-slate-300",
                ].join(" ")}
                key={languageOption}
              >
                {languageOption}
              </span>
            ))}
          </button>
          {isAuthenticated ? (
            <button
              className="inline-flex min-h-11 items-center rounded-md border border-lime/40 px-3 py-2 text-sm font-bold text-lime transition hover:bg-lime hover:text-pitch"
              type="button"
              onClick={logout}
            >
              {t("nav.logout")}
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
