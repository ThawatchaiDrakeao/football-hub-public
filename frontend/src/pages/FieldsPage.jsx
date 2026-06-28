import { useEffect, useState } from "react";
import { getFields } from "../api/fieldApi.js";
import FieldCard from "../components/FieldCard.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const fieldTypes = [
  { labelKey: "fields.allTypes", value: "" },
  { label: "5-a-side", value: "5-a-side" },
  { label: "7-a-side", value: "7-a-side" },
  { label: "11-a-side", value: "11-a-side" },
];

const FieldsPage = () => {
  const { t } = useLanguage();
  const [fields, setFields] = useState([]);
  const [search, setSearch] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadFields = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};
        if (search.trim()) params.search = search.trim();
        if (fieldType) params.fieldType = fieldType;

        const data = await getFields(params);

        if (isMounted) {
          setFields(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("fields.loadError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFields();

    return () => {
      isMounted = false;
    };
  }, [search, fieldType]);

  return (
    <PageShell
      title={t("fields.title")}
      description={t("fields.description")}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.search")}
          </span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("fields.searchPlaceholder")}
            type="search"
            value={search}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.fieldType")}
          </span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
            onChange={(event) => setFieldType(event.target.value)}
            value={fieldType}
          >
            {fieldTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.labelKey ? t(item.labelKey) : item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("fields.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && fields.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("fields.empty")}
        </div>
      ) : null}

      {!loading && !error && fields.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <FieldCard key={field._id} field={field} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};

export default FieldsPage;
