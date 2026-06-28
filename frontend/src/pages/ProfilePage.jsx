import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMyBookings } from "../api/bookingApi.js";
import { getMyCommunityPosts } from "../api/communityApi.js";
import { getMyOrders } from "../api/orderApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getStatusLabel } from "../utils/statusLabels.js";
import PageShell from "./PageShell.jsx";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const formatDate = (date) => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const getBookingFieldName = (booking, t) => {
  if (typeof booking.field === "object" && booking.field?.name) {
    return booking.field.name;
  }

  return booking.fieldName || t("common.unknownField");
};

const ProfilePage = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");
        const data = await getMyOrders();

        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setOrdersError(
            requestError.response?.data?.message ||
              t("profile.orderLoadError")
          );
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCommunityPosts = async () => {
      try {
        setCommunityLoading(true);
        setCommunityError("");
        const data = await getMyCommunityPosts();

        if (isMounted) {
          setCommunityPosts(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setCommunityError(
            requestError.response?.data?.message ||
              t("profile.communityLoadError")
          );
        }
      } finally {
        if (isMounted) {
          setCommunityLoading(false);
        }
      }
    };

    loadCommunityPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError("");
        const data = await getMyBookings();

        if (isMounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setBookingsError(
            requestError.response?.data?.message ||
              t("profile.bookingLoadError")
          );
        }
      } finally {
        if (isMounted) {
          setBookingsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageShell
      title={t("profile.title")}
      description={t("profile.description")}
    >
      {location.state?.message ? (
        <p className="mb-5 rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
          {location.state.message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="grid h-fit gap-4 rounded-lg border border-white/10 bg-black/20 p-5">
          <h2 className="text-xl font-black text-white">
            {t("profile.account")}
          </h2>

          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {t("common.name")}
            </p>
            <p className="mt-1 text-lg font-bold text-white">
              {user?.name || t("profile.unknownUser")}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {t("common.email")}
            </p>
            <p className="mt-1 text-lg font-bold text-white">
              {user?.email || t("profile.noEmail")}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-slate-500">
              {t("common.role")}
            </p>
            <p className="mt-1 text-lg font-bold capitalize text-white">
              {user?.role || "user"}
            </p>
          </div>

          <button
            className="mt-2 rounded-md border border-lime/40 px-4 py-3 text-sm font-black text-lime transition hover:bg-lime hover:text-pitch"
            onClick={logout}
            type="button"
          >
            {t("nav.logout")}
          </button>
        </section>

        <div className="space-y-6">
          <section
            className="rounded-lg border border-white/10 bg-black/20 p-5"
            id="orders"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {t("profile.myOrders")}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {t("profile.ordersDescription")}
                </p>
              </div>
              <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
                {orders.length} {t("profile.ordersCount")}
              </span>
            </div>

            {ordersLoading ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.loadingOrders")}
              </div>
            ) : null}

            {ordersError ? (
              <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
                {ordersError}
              </div>
            ) : null}

            {!ordersLoading && !ordersError && orders.length === 0 ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.noOrders")}
              </div>
            ) : null}

            {!ordersLoading && !ordersError && orders.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
                <div className="hidden grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 md:grid">
                  <span>{t("common.orderId")}</span>
                  <span>{t("common.statusLabel")}</span>
                  <span>{t("common.total")}</span>
                  <span>{t("common.created")}</span>
                </div>

                <div className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <article
                      className="grid gap-3 px-4 py-4 text-sm text-slate-300 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] md:items-center"
                      key={order._id}
                    >
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 md:hidden">
                          {t("common.orderId")}
                        </p>
                        <p className="font-bold text-white">{order._id}</p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 md:hidden">
                          {t("common.statusLabel")}
                        </p>
                        <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black capitalize text-lime">
                          {getStatusLabel(order.status, t)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 md:hidden">
                          {t("common.total")}
                        </p>
                        <p className="font-black text-white">
                          {formatPrice(order.totalPrice)} THB
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 md:hidden">
                          {t("common.created")}
                        </p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section
            className="rounded-lg border border-white/10 bg-black/20 p-5"
            id="bookings"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {t("profile.myBookings")}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {t("profile.bookingsDescription")}
                </p>
              </div>
              <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
                {bookings.length} {t("profile.bookingsCount")}
              </span>
            </div>

            {bookingsLoading ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.loadingBookings")}
              </div>
            ) : null}

            {bookingsError ? (
              <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
                {bookingsError}
              </div>
            ) : null}

            {!bookingsLoading && !bookingsError && bookings.length === 0 ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.noBookings")}
              </div>
            ) : null}

            {!bookingsLoading && !bookingsError && bookings.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
                <div className="hidden grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.9fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 lg:grid">
                  <span>{t("common.field")}</span>
                  <span>{t("common.date")}</span>
                  <span>{t("common.time")}</span>
                  <span>{t("common.statusLabel")}</span>
                  <span>{t("common.total")}</span>
                </div>

                <div className="divide-y divide-white/10">
                  {bookings.map((booking) => (
                    <article
                      className="grid gap-3 px-4 py-4 text-sm text-slate-300 lg:grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.9fr] lg:items-center"
                      key={booking._id}
                    >
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.field")}
                        </p>
                        <p className="font-bold text-white">
                          {getBookingFieldName(booking, t)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.date")}
                        </p>
                        <p>{booking.date}</p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.time")}
                        </p>
                        <p>
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.statusLabel")}
                        </p>
                        <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black capitalize text-lime">
                          {getStatusLabel(booking.status, t)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.total")}
                        </p>
                        <p className="font-black text-white">
                          {formatPrice(booking.totalPrice)} THB
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section
            className="rounded-lg border border-white/10 bg-black/20 p-5"
            id="community-posts"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {t("profile.myCommunityPosts")}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {t("profile.communityDescription")}
                </p>
              </div>
              <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
                {communityPosts.length} {t("profile.postsCount")}
              </span>
            </div>

            {communityLoading ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.loadingCommunity")}
              </div>
            ) : null}

            {communityError ? (
              <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
                {communityError}
              </div>
            ) : null}

            {!communityLoading &&
            !communityError &&
            communityPosts.length === 0 ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                {t("profile.noCommunity")}
              </div>
            ) : null}

            {!communityLoading &&
            !communityError &&
            communityPosts.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
                <div className="hidden grid-cols-[1.4fr_0.9fr_0.8fr_1fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 lg:grid">
                  <span>{t("common.title")}</span>
                  <span>{t("common.date")}</span>
                  <span>{t("common.statusLabel")}</span>
                  <span>{t("common.players")}</span>
                </div>

                <div className="divide-y divide-white/10">
                  {communityPosts.map((post) => (
                    <article
                      className="grid gap-3 px-4 py-4 text-sm text-slate-300 lg:grid-cols-[1.4fr_0.9fr_0.8fr_1fr] lg:items-center"
                      key={post._id}
                    >
                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.title")}
                        </p>
                        <p className="font-bold text-white">{post.title}</p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.date")}
                        </p>
                        <p>{post.matchDate}</p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.statusLabel")}
                        </p>
                        <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black capitalize text-lime">
                          {getStatusLabel(post.status, t)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                          {t("common.players")}
                        </p>
                        <p className="font-black text-white">
                          {post.currentPlayers} / {post.playersNeeded}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;
