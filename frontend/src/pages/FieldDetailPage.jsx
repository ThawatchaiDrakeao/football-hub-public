import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createBooking } from "../api/bookingApi.js";
import { getFieldById } from "../api/fieldApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const initialBookingForm = {
  date: "",
  startTime: "",
  endTime: "",
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const FieldDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [field, setField] = useState(null);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadField = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getFieldById(id);

        if (isMounted) {
          setField(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("fieldDetail.loadError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadField();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateBookingForm = () => {
    if (!bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
      return t("fieldDetail.requiredError");
    }

    if (bookingForm.startTime >= bookingForm.endTime) {
      return t("fieldDetail.timeOrderError");
    }

    return "";
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateBookingForm();
    if (validationMessage) {
      setBookingError(validationMessage);
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");
      setSuccessMessage("");

      await createBooking({
        field: id,
        date: bookingForm.date,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
      });

      setBookingForm(initialBookingForm);
      setSuccessMessage(t("fieldDetail.success"));
    } catch (requestError) {
      setBookingError(
        requestError.response?.data?.message ||
          t("fieldDetail.createError")
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const image = field?.images?.[0];

  return (
    <PageShell
      title={t("fieldDetail.title")}
      description={t("fieldDetail.description")}
    >
      {loading ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("fieldDetail.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && field ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
              <div className="aspect-[4/3] bg-white/5">
                {image ? (
                  <img
                    alt={field.name}
                    className="h-full w-full object-cover"
                    src={image}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                    {t("common.noImage")}
                  </div>
                )}
              </div>
            </div>

            <section className="rounded-lg border border-white/10 bg-black/25 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-bold uppercase text-lime">
                  {field.fieldType}
                </span>
                <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-300">
                  {field.location}
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black text-white">
                {field.name}
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                {field.description}
              </p>

              <div className="mt-6 grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {t("common.price")}
                  </p>
                  <p className="text-lg font-black text-lime">
                    {formatPrice(field.pricePerHour)} THB/hr
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {t("fieldDetail.opens")}
                  </p>
                  <p className="text-lg font-black text-white">
                    {field.openTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">
                    {t("fieldDetail.closes")}
                  </p>
                  <p className="text-lg font-black text-white">
                    {field.closeTime}
                  </p>
                </div>
              </div>

              {field.facilities?.length > 0 ? (
                <div className="mt-6">
                  <p className="text-sm font-bold text-slate-300">
                    {t("fieldDetail.facilities")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {field.facilities.map((facility) => (
                      <span
                        className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold capitalize text-slate-300"
                        key={facility}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-lime/20 bg-lime/10 p-5">
            <h2 className="text-xl font-black text-white">
              {t("fieldDetail.bookTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {t("fieldDetail.bookDescription")}
            </p>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4 text-slate-300">
                <p>{t("fieldDetail.loginRequired")}</p>
                <Link
                  className="mt-4 inline-flex rounded-md bg-lime px-4 py-2 text-sm font-black text-pitch transition hover:bg-white"
                  to="/login"
                >
                  {t("common.login")}
                </Link>
              </div>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={handleBookingSubmit}>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">
                    {t("common.date")}
                  </span>
                  <input
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                    name="date"
                    onChange={handleChange}
                    required
                    type="date"
                    value={bookingForm.date}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-300">
                      {t("common.startTime")}
                    </span>
                    <input
                      className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                      name="startTime"
                      onChange={handleChange}
                      required
                      type="time"
                      value={bookingForm.startTime}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-300">
                      {t("common.endTime")}
                    </span>
                    <input
                      className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                      name="endTime"
                      onChange={handleChange}
                      required
                      type="time"
                      value={bookingForm.endTime}
                    />
                  </label>
                </div>

                {bookingError ? (
                  <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                    {bookingError}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
                    {successMessage}
                  </p>
                ) : null}

                <button
                  className="w-full rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  disabled={bookingLoading}
                  type="submit"
                >
                  {bookingLoading
                    ? t("fieldDetail.booking")
                    : t("fieldDetail.bookButton")}
                </button>
              </form>
            )}
          </aside>
        </div>
      ) : null}
    </PageShell>
  );
};

export default FieldDetailPage;
