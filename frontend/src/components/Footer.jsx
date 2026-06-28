import { useLanguage } from "../context/LanguageContext.jsx";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>{t("footer.summary")}</p>
        <p>{t("footer.stack")}</p>
      </div>
    </footer>
  );
};

export default Footer;
