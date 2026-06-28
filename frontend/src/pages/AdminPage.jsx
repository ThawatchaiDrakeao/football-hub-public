import { useEffect, useState } from "react";
import BookingAdmin from "../admin/BookingAdmin.jsx";
import CommunityAdmin from "../admin/CommunityAdmin.jsx";
import FieldAdmin from "../admin/FieldAdmin.jsx";
import OrderAdmin from "../admin/OrderAdmin.jsx";
import ProductAdmin from "../admin/ProductAdmin.jsx";
import {
  getBookingsAdmin,
  getCommunityPostsAdmin,
  getFieldsAdmin,
  getOrdersAdmin,
  getProductsAdmin,
} from "../admin/adminApi.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const tabs = [
  "overview",
  "products",
  "orders",
  "fields",
  "bookings",
  "community",
];

const AdminPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState({
    productsCount: 0,
    ordersCount: 0,
    fieldsCount: 0,
    bookingsCount: 0,
    communityPostsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const [products, orders, fields, bookings, communityPosts] =
          await Promise.all([
            getProductsAdmin(),
            getOrdersAdmin(),
            getFieldsAdmin(),
            getBookingsAdmin(),
            getCommunityPostsAdmin(),
          ]);

        if (isMounted) {
          setOverview({
            productsCount: Array.isArray(products) ? products.length : 0,
            ordersCount: Array.isArray(orders) ? orders.length : 0,
            fieldsCount: Array.isArray(fields) ? fields.length : 0,
            bookingsCount: Array.isArray(bookings) ? bookings.length : 0,
            communityPostsCount: Array.isArray(communityPosts)
              ? communityPosts.length
              : 0,
          });
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("admin.overviewError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageShell
      title={t("admin.title")}
      description={t("admin.description")}
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            className={[
              "rounded-md px-4 py-2 text-sm font-black transition",
              activeTab === tab
                ? "bg-lime text-pitch"
                : "border border-white/10 text-slate-300 hover:border-lime/50 hover:text-lime",
            ].join(" ")}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {t(`admin.${tab}`)}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <section className="mt-6">
          {loading ? (
            <div className="rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
              {t("admin.loadingOverview")}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <article className="rounded-lg border border-lime/20 bg-lime/10 p-5">
                <p className="text-xs font-black uppercase text-lime">
                  {t("admin.products")}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {overview.productsCount}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {t("admin.overviewProducts")}
                </p>
              </article>

              <article className="rounded-lg border border-lime/20 bg-lime/10 p-5">
                <p className="text-xs font-black uppercase text-lime">
                  {t("admin.orders")}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {overview.ordersCount}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {t("admin.overviewOrders")}
                </p>
              </article>

              <article className="rounded-lg border border-lime/20 bg-lime/10 p-5">
                <p className="text-xs font-black uppercase text-lime">
                  {t("admin.fields")}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {overview.fieldsCount}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {t("admin.overviewFields")}
                </p>
              </article>

              <article className="rounded-lg border border-lime/20 bg-lime/10 p-5">
                <p className="text-xs font-black uppercase text-lime">
                  {t("admin.bookings")}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {overview.bookingsCount}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {t("admin.overviewBookings")}
                </p>
              </article>

              <article className="rounded-lg border border-lime/20 bg-lime/10 p-5">
                <p className="text-xs font-black uppercase text-lime">
                  {t("admin.community")}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {overview.communityPostsCount}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {t("admin.overviewCommunity")}
                </p>
              </article>
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === "products" ? (
        <div className="mt-6">
          <ProductAdmin />
        </div>
      ) : null}

      {activeTab === "orders" ? (
        <div className="mt-6">
          <OrderAdmin />
        </div>
      ) : null}

      {activeTab === "fields" ? (
        <div className="mt-6">
          <FieldAdmin />
        </div>
      ) : null}

      {activeTab === "bookings" ? (
        <div className="mt-6">
          <BookingAdmin />
        </div>
      ) : null}

      {activeTab === "community" ? (
        <div className="mt-6">
          <CommunityAdmin />
        </div>
      ) : null}
    </PageShell>
  );
};

export default AdminPage;
