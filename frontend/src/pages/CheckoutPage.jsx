import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const initialShippingAddress = {
  fullName: "",
  phone: "",
  address: "",
  province: "",
  postalCode: "",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const [shippingAddress, setShippingAddress] = useState(
    initialShippingAddress
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [name]: value,
    }));
  };

  const validateForm = () => {
    return Object.values(shippingAddress).every((value) => value.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError(t("checkout.cartEmptyError"));
      return;
    }

    if (!validateForm()) {
      setError(t("checkout.requiredError"));
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    }));

    try {
      setLoading(true);
      setError("");

      await createOrder({
        items: orderItems,
        shippingAddress,
        paymentMethod: "mock",
      });

      clearCart();
      setShippingAddress(initialShippingAddress);
      setSuccessMessage(t("checkout.success"));

      setTimeout(() => {
        navigate("/profile/orders", {
          state: { message: t("checkout.stateSuccess") },
        });
      }, 1200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("checkout.createError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title={t("checkout.title")}
      description={t("checkout.description")}
    >
      {cartItems.length === 0 && !successMessage ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          <p>{t("cart.empty")}</p>
          <Link
            className="mt-4 inline-flex rounded-md bg-lime px-4 py-2 text-sm font-black text-pitch transition hover:bg-white"
            to="/products"
          >
            {t("common.browseProducts")}
          </Link>
        </div>
      ) : (
        <form
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
          onSubmit={handleSubmit}
        >
          <section className="rounded-lg border border-white/10 bg-black/25 p-5">
            <h2 className="text-xl font-black text-white">
              {t("checkout.shippingInfo")}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-slate-300">
                  {t("checkout.fullName")}
                </span>
                <input
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                  name="fullName"
                  onChange={handleChange}
                  placeholder={t("checkout.fullNamePlaceholder")}
                  required
                  type="text"
                  value={shippingAddress.fullName}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-300">
                  {t("checkout.phone")}
                </span>
                <input
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                  name="phone"
                  onChange={handleChange}
                  placeholder={t("checkout.phonePlaceholder")}
                  required
                  type="tel"
                  value={shippingAddress.phone}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-300">
                  {t("checkout.province")}
                </span>
                <input
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                  name="province"
                  onChange={handleChange}
                  placeholder={t("checkout.provincePlaceholder")}
                  required
                  type="text"
                  value={shippingAddress.province}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-slate-300">
                  {t("checkout.address")}
                </span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                  name="address"
                  onChange={handleChange}
                  placeholder={t("checkout.addressPlaceholder")}
                  required
                  value={shippingAddress.address}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-300">
                  {t("checkout.postalCode")}
                </span>
                <input
                  className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                  name="postalCode"
                  onChange={handleChange}
                  placeholder={t("checkout.postalCodePlaceholder")}
                  required
                  type="text"
                  value={shippingAddress.postalCode}
                />
              </label>
            </div>

            {error ? (
              <p className="mt-5 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                {error}
              </p>
            ) : null}

            {successMessage ? (
              <p className="mt-5 rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
                {successMessage}
              </p>
            ) : null}
          </section>

          <aside className="h-fit rounded-lg border border-lime/20 bg-lime/10 p-5">
            <h2 className="text-xl font-black text-white">
              {t("checkout.summary")}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {cartItems.map((item) => (
                <div
                  className="border-b border-white/10 pb-3 last:border-b-0"
                  key={item.cartKey}
                >
                  <div className="flex justify-between gap-3">
                    <span>{item.name}</span>
                    <span className="font-bold text-white">
                      x{item.quantity}
                    </span>
                  </div>
                  {item.size ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {t("common.size")}: {item.size}
                    </p>
                  ) : null}
                </div>
              ))}

              <div className="flex justify-between gap-3 pt-2">
                <span>{t("common.total")}</span>
                <span className="font-black text-lime">
                  {cartTotal.toLocaleString("th-TH")} THB
                </span>
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={loading || cartItems.length === 0}
              type="submit"
            >
              {loading ? t("checkout.creating") : t("checkout.placeOrder")}
            </button>
          </aside>
        </form>
      )}
    </PageShell>
  );
};

export default CheckoutPage;
