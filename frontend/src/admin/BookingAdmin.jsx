import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getStatusLabel } from "../utils/statusLabels.js";
import { getBookingsAdmin, updateBookingStatus } from "./adminApi.js";

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const getBookingUser = (booking, t) => {
  if (typeof booking.user === "object" && booking.user) {
    return booking.user.email || booking.user.name || t("common.unknownUser");
  }

  return t("common.unknownUser");
};

const getBookingField = (booking, t) => {
  if (typeof booking.field === "object" && booking.field) {
    return booking.field.name || booking.field.location || t("common.unknownField");
  }

  return t("common.unknownField");
};

const BookingAdmin = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBookingsAdmin();
      setBookings(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.loadBookingsError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      setError("");
      setMessage("");

      const updatedBooking = await updateBookingStatus(bookingId, status);
      setBookings((currentBookings) => {
        return currentBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, ...updatedBooking } : booking
        );
      });
      setMessage(t("admin.bookingUpdated"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.bookingUpdateError")
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">
            {t("admin.bookingsTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("admin.bookingsDescription")}
          </p>
        </div>
        <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
          {bookings.length} {t("admin.count.bookings")}
        </span>
      </div>

      {loading ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.loadingBookings")}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-lg border border-lime/30 bg-lime/10 p-5 text-lime">
          {message}
        </div>
      ) : null}

      {!loading && !error && bookings.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.noBookings")}
        </div>
      ) : null}

      {!loading && !error && bookings.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_0.7fr_0.8fr_0.8fr_0.9fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 xl:grid">
            <span>{t("common.bookingId")}</span>
            <span>{t("common.user")}</span>
            <span>{t("common.field")}</span>
            <span>{t("common.date")}</span>
            <span>{t("common.time")}</span>
            <span>{t("common.total")}</span>
            <span>{t("common.statusLabel")}</span>
          </div>

          <div className="divide-y divide-white/10">
            {bookings.map((booking) => (
              <article
                className="grid gap-4 px-4 py-4 text-sm text-slate-300 xl:grid-cols-[1.3fr_1fr_1fr_0.7fr_0.8fr_0.8fr_0.9fr] xl:items-center"
                key={booking._id}
              >
                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.bookingId")}
                  </p>
                  <p className="break-all font-bold text-white">
                    {booking._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.user")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {getBookingUser(booking, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.field")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {getBookingField(booking, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.date")}
                  </p>
                  <p className="font-bold text-white">{booking.date}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.time")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.total")}
                  </p>
                  <p className="font-bold text-lime">
                    {formatPrice(booking.totalPrice)} THB
                  </p>
                </div>

                <label className="block">
                  <span className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.statusLabel")}
                  </span>
                  <select
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm font-bold capitalize text-white outline-none transition focus:border-lime xl:mt-0"
                    disabled={updatingId === booking._id}
                    onChange={(event) =>
                      handleStatusChange(booking._id, event.target.value)
                    }
                    value={booking.status}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status, t)}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default BookingAdmin;
