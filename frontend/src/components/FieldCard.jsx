import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const FieldCard = ({ field }) => {
  const image = field.images?.[0];
  const { t } = useLanguage();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-card shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-lime/70 hover:shadow-lime/10">
      <div className="aspect-[4/3] overflow-hidden bg-white/5">
        {image ? (
          <img
            alt={field.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={image}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
            {t("common.noImage")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-lime/40 bg-lime/10 px-2 py-1 text-xs font-black uppercase tracking-wide text-lime">
            {field.fieldType}
          </span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-semibold text-slate-300">
            {field.location}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-black text-white">{field.name}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {field.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                {t("fieldCard.pricePerHour")}
              </p>
              <p className="text-xl font-black text-lime drop-shadow-[0_0_12px_rgba(217,255,0,0.18)]">
                {formatPrice(field.pricePerHour)} THB
              </p>
            </div>
            <p className="rounded-md border border-field/40 bg-field/10 px-2 py-1 text-xs font-bold text-slate-200">
              {field.openTime} - {field.closeTime}
            </p>
          </div>

          <Link
            className="mt-4 inline-flex w-full justify-center rounded-md bg-lime px-4 py-2.5 text-sm font-black uppercase tracking-wide text-pitch transition hover:bg-white"
            to={`/fields/${field._id}`}
          >
            {t("fieldCard.viewAndBook")}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FieldCard;
