import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../api/productApi.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const categories = [
  { labelKey: "products.allCategories", value: "" },
  { labelKey: "common.categoryValue.shoes", value: "shoes" },
  { labelKey: "common.categoryValue.jersey", value: "jersey" },
  { labelKey: "common.categoryValue.ball", value: "ball" },
  { labelKey: "common.categoryValue.gloves", value: "gloves" },
  { labelKey: "common.categoryValue.training", value: "training" },
  { labelKey: "common.categoryValue.accessories", value: "accessories" },
];

const ProductsPage = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;

        const data = await getProducts(params);

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              t("products.loadError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [search, category]);

  return (
    <PageShell
      title={t("products.title")}
      description={t("products.description")}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.search")}
          </span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("products.searchPlaceholder")}
            type="search"
            value={search}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.category")}
          </span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("products.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("products.empty")}
        </div>
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};

export default ProductsPage;
