import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const CartPage = () => {
  const { t } = useLanguage();
  const {
    cartItems,
    cartCount,
    cartTotal,
    clearCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <PageShell
      title={t("cart.title")}
      description={t("cart.description")}
    >
      {cartItems.length === 0 ? (
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <article
                className="grid gap-4 rounded-lg border border-white/10 bg-black/25 p-4 sm:grid-cols-[96px_1fr]"
                key={item.cartKey}
              >
                <div className="h-24 overflow-hidden rounded-md bg-white/5">
                  {item.image ? (
                    <img
                      alt={item.name}
                      className="h-full w-full object-cover"
                      src={item.image}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                      {t("common.noImage")}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-white">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.brand || item.category}
                        {item.size ? ` | ${t("common.size")}: ${item.size}` : ""}
                      </p>
                      <p className="mt-2 text-base font-black text-lime">
                        {formatPrice(item.price)} THB
                      </p>
                    </div>

                    <button
                      className="self-start rounded-md border border-red-400/30 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10"
                      onClick={() => removeFromCart(item._id, item.size)}
                      type="button"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center overflow-hidden rounded-md border border-white/10 bg-black/20">
                      <button
                        className="h-10 w-10 text-lg font-black text-slate-300 transition hover:bg-white/10"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.quantity - 1)
                        }
                        type="button"
                      >
                        -
                      </button>
                      <span className="flex h-10 w-12 items-center justify-center border-x border-white/10 text-sm font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        className="h-10 w-10 text-lg font-black text-slate-300 transition hover:bg-white/10"
                        disabled={item.stock > 0 && item.quantity >= item.stock}
                        onClick={() =>
                          updateQuantity(item._id, item.size, item.quantity + 1)
                        }
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-300">
                      {t("common.subtotal")}:{" "}
                      {formatPrice(item.price * item.quantity)} THB
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-lime/20 bg-lime/10 p-5">
            <h2 className="text-xl font-black text-white">
              {t("cart.summary")}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between gap-3">
                <span>{t("common.items")}</span>
                <span className="font-black text-white">{cartCount}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
                <span>{t("common.total")}</span>
                <span className="font-black text-lime">
                  {formatPrice(cartTotal)} THB
                </span>
              </div>
            </div>

            <Link
              className="mt-5 inline-flex w-full justify-center rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white"
              to="/checkout"
            >
              {t("cart.checkout")}
            </Link>
            <button
              className="mt-3 w-full rounded-md border border-white/10 px-4 py-3 text-sm font-black text-slate-200 transition hover:border-red-400/40 hover:text-red-200"
              onClick={clearCart}
              type="button"
            >
              {t("cart.clear")}
            </button>
          </aside>
        </div>
      )}
    </PageShell>
  );
};

export default CartPage;
