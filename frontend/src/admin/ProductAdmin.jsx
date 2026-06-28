import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getCategoryLabel } from "../utils/statusLabels.js";
import AdminImageManager from "./AdminImageManager.jsx";
import {
  createProduct,
  deleteProduct,
  getProductsAdmin,
  updateProduct,
} from "./adminApi.js";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  category: "shoes",
  brand: "",
  sizes: "",
  stock: "0",
  images: [],
};

const categories = ["shoes", "jersey", "ball", "gloves", "training", "accessories"];

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const ProductAdmin = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formMode, setFormMode] = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductsAdmin();
      setProducts(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.loadProductsError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `${t("admin.confirmProductDelete")} "${product.name}"? ${t(
        "admin.confirmProductDeleteSuffix"
      )}`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");
      setMessage("");
      await deleteProduct(product._id);
      setProducts((currentProducts) => {
        return currentProducts.filter((item) => item._id !== product._id);
      });
      setMessage(t("admin.productDeleted"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.productDeleteError")
      );
    } finally {
      setDeletingId("");
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedProductId("");
    setProductForm(emptyProductForm);
    setFormError("");
    setMessage("");
  };

  const openEditForm = (product) => {
    setFormMode("edit");
    setSelectedProductId(product._id);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "shoes",
      brand: product.brand || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      stock: String(product.stock ?? 0),
      images: Array.isArray(product.images) ? product.images : [],
    });
    setFormError("");
    setMessage("");
  };

  const closeForm = () => {
    setFormMode("");
    setSelectedProductId("");
    setProductForm(emptyProductForm);
    setFormError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const buildProductPayload = () => {
    return {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      sizes: productForm.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
    };
  };

  const validateProductForm = () => {
    if (
      !productForm.name.trim() ||
      !productForm.description.trim() ||
      productForm.price === "" ||
      productForm.stock === ""
    ) {
      return t("admin.formRequired");
    }

    if (Number(productForm.price) < 0 || Number(productForm.stock) < 0) {
      return t("admin.negativeNumberError");
    }

    return "";
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();

    const validationMessage = validateProductForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setFormSaving(true);
      setFormError("");
      setMessage("");

      const payload = buildProductPayload();

      if (formMode === "edit") {
        const updatedProduct = await updateProduct(selectedProductId, payload);
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === selectedProductId
              ? { ...product, ...updatedProduct }
              : product
          )
        );
        setMessage(t("admin.productUpdated"));
      } else {
        const createdProduct = await createProduct(payload);
        setProducts((currentProducts) => [createdProduct, ...currentProducts]);
        setMessage(t("admin.productCreated"));
      }

      closeForm();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          (formMode === "edit"
            ? t("admin.productUpdateError")
            : t("admin.productCreateError"))
      );
    } finally {
      setFormSaving(false);
    }
  };

  const handleSaveImages = async (product, images) => {
    const updatedProduct = await updateProduct(product._id, { images });

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item._id === product._id ? { ...item, ...updatedProduct } : item
      )
    );

    return updatedProduct;
  };

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">
            {t("admin.productsTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("admin.productsDescription")}
          </p>
        </div>
        <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
          {products.length} {t("admin.count.products")}
        </span>
      </div>

      <div className="mt-5">
        <button
          className="rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white"
          onClick={openCreateForm}
          type="button"
        >
          {t("admin.addProduct")}
        </button>
      </div>

      {formMode ? (
        <form
          className="mt-5 grid gap-4 rounded-lg border border-lime/20 bg-lime/5 p-5 sm:grid-cols-2"
          onSubmit={handleSubmitProduct}
        >
          <div className="sm:col-span-2">
            <h3 className="text-lg font-black text-white">
              {formMode === "edit"
                ? t("admin.editProduct")
                : t("admin.addProduct")}
            </h3>
          </div>

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-slate-300">
              {t("common.name")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="name"
              onChange={handleFormChange}
              required
              type="text"
              value={productForm.name}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-slate-300">
              {t("common.description")}
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="description"
              onChange={handleFormChange}
              required
              value={productForm.description}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.price")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              min="0"
              name="price"
              onChange={handleFormChange}
              required
              type="number"
              value={productForm.price}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.stock")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              min="0"
              name="stock"
              onChange={handleFormChange}
              required
              type="number"
              value={productForm.stock}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.category")}
            </span>
            <select
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="category"
              onChange={handleFormChange}
              value={productForm.category}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category, t)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("admin.brand")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="brand"
              onChange={handleFormChange}
              type="text"
              value={productForm.brand}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-slate-300">
              {t("admin.sizes")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
              name="sizes"
              onChange={handleFormChange}
              placeholder={t("admin.commaSeparatedPlaceholder")}
              type="text"
              value={productForm.sizes}
            />
          </label>

          <div className="sm:col-span-2">
            <AdminImageManager
              images={productForm.images}
              itemName={productForm.name || t("admin.productImageAlt")}
              onImagesChange={(images) =>
                setProductForm((currentForm) => ({ ...currentForm, images }))
              }
              showSaveButton={false}
            />
          </div>

          {formError ? (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 sm:col-span-2">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button
              className="rounded-md bg-lime px-5 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={formSaving}
              type="submit"
            >
              {formSaving
                ? t("admin.saving")
                : formMode === "edit"
                  ? t("admin.update")
                  : t("admin.create")}
            </button>
            <button
              className="rounded-md border border-white/10 px-5 py-3 text-sm font-black text-slate-200 transition hover:border-lime/60 hover:text-lime"
              onClick={closeForm}
              type="button"
            >
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      ) : null}

      {loading ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.loadingProducts")}
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

      {!loading && !error && products.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.noProducts")}
        </div>
      ) : null}

      {!loading && !error && products.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[88px_1.4fr_0.8fr_0.6fr_0.7fr_0.8fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 lg:grid">
            <span>{t("common.image")}</span>
            <span>{t("common.name")}</span>
            <span>{t("common.price")}</span>
            <span>{t("common.stock")}</span>
            <span>{t("common.statusLabel")}</span>
            <span>{t("common.action")}</span>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((product) => (
              <article
                className="grid gap-4 px-4 py-4 text-sm text-slate-300 lg:grid-cols-[88px_1.4fr_0.8fr_0.6fr_0.7fr_0.8fr] lg:items-center"
                key={product._id}
              >
                <div className="h-16 w-20 overflow-hidden rounded-md bg-white/5">
                  {product.images?.[0] ? (
                    <img
                      alt={product.name}
                      className="h-full w-full object-cover"
                      src={product.images[0]}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                      {t("common.noImage")}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.name")}
                  </p>
                  <p className="font-black text-white">{product.name}</p>
                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {getCategoryLabel(product.category, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.price")}
                  </p>
                  <p className="font-bold text-lime">
                    {formatPrice(product.price)} THB
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.stock")}
                  </p>
                  <p className="font-bold text-white">{product.stock}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 lg:hidden">
                    {t("common.statusLabel")}
                  </p>
                  <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black text-lime">
                    {product.isActive === false
                      ? t("common.inactive")
                      : t("common.active")}
                  </span>
                </div>

                <div className="grid gap-2">
                  <button
                    className="rounded-md border border-lime/40 px-3 py-2 text-sm font-black text-lime transition hover:bg-lime hover:text-pitch"
                    onClick={() => openEditForm(product)}
                    type="button"
                  >
                    {t("admin.editProduct")}
                  </button>
                  <button
                    className="rounded-md border border-red-400/30 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                    disabled={deletingId === product._id}
                    onClick={() => handleDelete(product)}
                    type="button"
                  >
                    {deletingId === product._id
                      ? t("admin.deleting")
                      : t("admin.softDelete")}
                  </button>
                </div>

                <div className="lg:col-span-6">
                  <AdminImageManager
                    images={product.images}
                    itemName={product.name}
                    onSave={(images) => handleSaveImages(product, images)}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductAdmin;
