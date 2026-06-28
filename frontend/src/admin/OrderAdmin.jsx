import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getStatusLabel } from "../utils/statusLabels.js";
import { getOrdersAdmin, updateOrderStatus } from "./adminApi.js";

const statusOptions = ["pending", "paid", "shipped", "completed", "cancelled"];

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const getOrderUser = (order, t) => {
  if (typeof order.user === "object" && order.user) {
    return order.user.email || order.user.name || t("common.unknownUser");
  }

  return t("common.unknownUser");
};

const OrderAdmin = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getOrdersAdmin();
      setOrders(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || t("admin.loadOrdersError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) => {
        return currentOrders.map((order) =>
          order._id === orderId ? { ...order, ...updatedOrder } : order
        );
      });
      setMessage(t("admin.orderUpdated"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.orderUpdateError")
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
            {t("admin.ordersTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("admin.ordersDescription")}
          </p>
        </div>
        <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
          {orders.length} {t("admin.count.orders")}
        </span>
      </div>

      {loading ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.loadingOrders")}
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

      {!loading && !error && orders.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.noOrders")}
        </div>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[1.4fr_1.2fr_0.8fr_0.9fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 lg:grid">
            <span>{t("common.orderId")}</span>
            <span>{t("common.user")}</span>
            <span>{t("common.total")}</span>
            <span>{t("common.statusLabel")}</span>
          </div>

          <div className="divide-y divide-white/10">
            {orders.map((order) => (
              <article
                className="grid gap-4 px-4 py-4 text-sm text-slate-300 lg:grid-cols-[1.4fr_1.2fr_0.8fr_0.9fr] lg:items-center"
                key={order._id}
              >
                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.orderId")}
                  </p>
                  <p className="break-all font-bold text-white">{order._id}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.user")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {getOrderUser(order, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.total")}
                  </p>
                  <p className="font-bold text-lime">
                    {formatPrice(order.totalPrice)} THB
                  </p>
                </div>

                <label className="block">
                  <span className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.statusLabel")}
                  </span>
                  <select
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm font-bold capitalize text-white outline-none transition focus:border-lime lg:mt-0"
                    disabled={updatingId === order._id}
                    onChange={(event) =>
                      handleStatusChange(order._id, event.target.value)
                    }
                    value={order.status}
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

export default OrderAdmin;
