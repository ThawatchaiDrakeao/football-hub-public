import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t("notFound.title")}
      description={t("notFound.description")}
    >
      <Link
        to="/"
        className="inline-flex rounded-md bg-lime px-4 py-2 text-sm font-bold text-pitch"
      >
        {t("notFound.backHome")}
      </Link>
    </PageShell>
  );
};

export default NotFoundPage;
