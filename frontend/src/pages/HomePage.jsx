import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

const featureKeys = [
  "home.features.store",
  "home.features.booking",
  "home.features.teammates",
];

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-pitch">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/football-stadium-hero.png')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,11,0.96)_0%,rgba(7,17,11,0.82)_42%,rgba(7,17,11,0.46)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(217,255,0,0.18),transparent_22rem),linear-gradient(180deg,rgba(7,17,11,0.08),#07110B_96%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-md border border-lime/50 bg-lime/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-lime">
            {t("home.eyebrow")}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            {t("home.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {t("home.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-pitch shadow-lg shadow-lime/20 transition hover:-translate-y-0.5 hover:bg-white"
              to="/products"
            >
              {t("home.primaryAction")}
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-field/80 bg-field/15 px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-field/10 transition hover:-translate-y-0.5 hover:border-lime hover:text-lime"
              to="/fields"
            >
              {t("home.secondaryAction")}
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {featureKeys.map((featureKey) => (
            <article
              key={featureKey}
              className="rounded-lg border border-white/10 bg-card/60 p-5 shadow-2xl shadow-black/30 backdrop-blur-md transition hover:-translate-y-1 hover:border-lime/70 hover:shadow-lime/10"
            >
              <div className="mb-5 h-1.5 w-14 rounded-full bg-lime shadow-[0_0_24px_rgba(217,255,0,0.45)]" />
              <h2 className="text-xl font-black text-white">
                {t(`${featureKey}.title`)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {t(`${featureKey}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
