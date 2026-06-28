import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/productApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getCategoryLabel } from "../utils/statusLabels.js";
import PageShell from "./PageShell.jsx";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        if (isMounted) {
          setProduct(data);
          setSelectedSize(data.sizes?.[0] || "");
          setQuantity(data.stock > 0 ? 1 : 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              t("productDetail.loadError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleQuantityChange = (nextQuantity) => {
    const stock = Number(product?.stock) || 0;
    const safeQuantity = Math.min(Math.max(Number(nextQuantity) || 1, 1), stock);
    setQuantity(safeQuantity);
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    addToCart(product, quantity, selectedSize);
    setSuccessMessage(t("productDetail.addedToCart"));
  };

  const image = product?.images?.[0];
  const hasSizes = product?.sizes?.length > 0;

  return (
    <PageShell
      title={t("productDetail.title")}
      description={t("productDetail.description")}
    >
      {loading ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("productDetail.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && product ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
            <div className="aspect-[4/3] bg-white/5">
              {image ? (
                <img
                  alt={product.name}
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

          <div className="rounded-lg border border-white/10 bg-black/25 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-bold uppercase text-lime">
                {getCategoryLabel(product.category, t)}
              </span>
              {product.brand ? (
                <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-300">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 text-3xl font-black text-white">
              {product.name}
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              {product.description}
            </p>

            <div className="mt-6 grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.price")}
                </p>
                <p className="text-2xl font-black text-lime">
                  {formatPrice(product.price)} THB
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.stock")}
                </p>
                <p className="text-lg font-black text-white">
                  {product.stock > 0
                    ? `${product.stock} ${t("productDetail.available")}`
                    : t("productDetail.outOfStock")}
                </p>
              </div>
            </div>

            {hasSizes ? (
              <div className="mt-6">
                <p className="text-sm font-bold text-slate-300">
                  {t("common.size")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      className={[
                        "rounded-md border px-4 py-2 text-sm font-black transition",
                        selectedSize === size
                          ? "border-lime bg-lime text-pitch"
                          : "border-white/10 bg-black/20 text-slate-300 hover:border-lime/60",
                      ].join(" ")}
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-sm font-bold text-slate-300">
                {t("common.quantity")}
              </p>
              <div className="mt-3 flex max-w-40 items-center overflow-hidden rounded-md border border-white/10 bg-black/20">
                <button
                  className="h-11 w-11 text-lg font-black text-slate-300 transition hover:bg-white/10"
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  type="button"
                >
                  -
                </button>
                <input
                  className="h-11 w-16 border-x border-white/10 bg-transparent text-center text-sm font-black text-white outline-none"
                  max={product.stock}
                  min="1"
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  type="number"
                  value={quantity}
                />
                <button
                  className="h-11 w-11 text-lg font-black text-slate-300 transition hover:bg-white/10"
                  disabled={quantity >= product.stock}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            {successMessage ? (
              <p className="mt-4 rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
                {successMessage}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-md bg-lime px-5 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                disabled={product.stock <= 0 || quantity <= 0}
                onClick={handleAddToCart}
                type="button"
              >
                {t("productDetail.addToCart")}
              </button>
              <Link
                className="rounded-md border border-white/10 px-5 py-3 text-center text-sm font-black text-slate-200 transition hover:border-lime/60 hover:text-lime"
                to="/products"
              >
                {t("productDetail.backToProducts")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
};

export default ProductDetailPage;
