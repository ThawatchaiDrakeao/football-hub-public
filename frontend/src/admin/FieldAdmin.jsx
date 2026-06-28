import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import AdminImageManager from "./AdminImageManager.jsx";
import { createField, deleteField, getFieldsAdmin, updateField } from "./adminApi.js";

const emptyFieldForm = {
  name: "",
  location: "",
  description: "",
  pricePerHour: "",
  fieldType: "7-a-side",
  openTime: "10:00",
  closeTime: "22:00",
  facilities: "",
  images: [],
};

const fieldTypes = ["5-a-side", "7-a-side", "11-a-side"];

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("th-TH");
};

const FieldAdmin = () => {
  const { t } = useLanguage();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [fieldForm, setFieldForm] = useState(emptyFieldForm);
  const [formError, setFormError] = useState("");
  const [formMode, setFormMode] = useState("");
  const [formSaving, setFormSaving] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [message, setMessage] = useState("");

  const loadFields = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFieldsAdmin();
      setFields(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.loadFieldsError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleDelete = async (field) => {
    const confirmed = window.confirm(
      `${t("admin.confirmFieldDelete")} "${field.name}"? ${t(
        "admin.confirmFieldDeleteSuffix"
      )}`
    );

    if (!confirmed) return;

    try {
      setDeletingId(field._id);
      setError("");
      setMessage("");

      await deleteField(field._id);
      setFields((currentFields) => {
        return currentFields.filter((item) => item._id !== field._id);
      });
      setMessage(t("admin.fieldDeleted"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.fieldDeleteError")
      );
    } finally {
      setDeletingId("");
    }
  };

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedFieldId("");
    setFieldForm(emptyFieldForm);
    setFormError("");
    setMessage("");
  };

  const openEditForm = (field) => {
    setFormMode("edit");
    setSelectedFieldId(field._id);
    setFieldForm({
      name: field.name || "",
      location: field.location || "",
      description: field.description || "",
      pricePerHour: String(field.pricePerHour ?? ""),
      fieldType: field.fieldType || "7-a-side",
      openTime: field.openTime || "10:00",
      closeTime: field.closeTime || "22:00",
      facilities: Array.isArray(field.facilities)
        ? field.facilities.join(", ")
        : "",
      images: Array.isArray(field.images) ? field.images : [],
    });
    setFormError("");
    setMessage("");
  };

  const closeForm = () => {
    setFormMode("");
    setSelectedFieldId("");
    setFieldForm(emptyFieldForm);
    setFormError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFieldForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const buildFieldPayload = () => {
    return {
      ...fieldForm,
      pricePerHour: Number(fieldForm.pricePerHour),
      facilities: fieldForm.facilities
        .split(",")
        .map((facility) => facility.trim())
        .filter(Boolean),
    };
  };

  const validateFieldForm = () => {
    if (
      !fieldForm.name.trim() ||
      !fieldForm.location.trim() ||
      !fieldForm.description.trim() ||
      fieldForm.pricePerHour === "" ||
      !fieldForm.openTime ||
      !fieldForm.closeTime
    ) {
      return t("admin.formRequired");
    }

    if (Number(fieldForm.pricePerHour) < 0) {
      return t("admin.negativeNumberError");
    }

    if (fieldForm.openTime >= fieldForm.closeTime) {
      return t("admin.openCloseTimeError");
    }

    return "";
  };

  const handleSubmitField = async (event) => {
    event.preventDefault();

    const validationMessage = validateFieldForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setFormSaving(true);
      setFormError("");
      setMessage("");

      const payload = buildFieldPayload();

      if (formMode === "edit") {
        const updatedField = await updateField(selectedFieldId, payload);
        setFields((currentFields) =>
          currentFields.map((field) =>
            field._id === selectedFieldId ? { ...field, ...updatedField } : field
          )
        );
        setMessage(t("admin.fieldUpdated"));
      } else {
        const createdField = await createField(payload);
        setFields((currentFields) => [createdField, ...currentFields]);
        setMessage(t("admin.fieldCreated"));
      }

      closeForm();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          (formMode === "edit"
            ? t("admin.fieldUpdateError")
            : t("admin.fieldCreateError"))
      );
    } finally {
      setFormSaving(false);
    }
  };

  const handleSaveImages = async (field, images) => {
    const updatedField = await updateField(field._id, { images });

    setFields((currentFields) =>
      currentFields.map((item) =>
        item._id === field._id ? { ...item, ...updatedField } : item
      )
    );

    return updatedField;
  };

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">
            {t("admin.fieldsTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("admin.fieldsDescription")}
          </p>
        </div>
        <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
          {fields.length} {t("admin.count.fields")}
        </span>
      </div>

      <div className="mt-5">
        <button
          className="rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white"
          onClick={openCreateForm}
          type="button"
        >
          {t("admin.addField")}
        </button>
      </div>

      {formMode ? (
        <form
          className="mt-5 grid gap-4 rounded-lg border border-lime/20 bg-lime/5 p-5 sm:grid-cols-2"
          onSubmit={handleSubmitField}
        >
          <div className="sm:col-span-2">
            <h3 className="text-lg font-black text-white">
              {formMode === "edit" ? t("admin.editField") : t("admin.addField")}
            </h3>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.name")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="name"
              onChange={handleFormChange}
              required
              type="text"
              value={fieldForm.name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.location")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="location"
              onChange={handleFormChange}
              required
              type="text"
              value={fieldForm.location}
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
              value={fieldForm.description}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("fieldCard.pricePerHour")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              min="0"
              name="pricePerHour"
              onChange={handleFormChange}
              required
              type="number"
              value={fieldForm.pricePerHour}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("common.fieldType")}
            </span>
            <select
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="fieldType"
              onChange={handleFormChange}
              value={fieldForm.fieldType}
            >
              {fieldTypes.map((fieldType) => (
                <option key={fieldType} value={fieldType}>
                  {fieldType}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("fieldDetail.opens")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="openTime"
              onChange={handleFormChange}
              required
              type="time"
              value={fieldForm.openTime}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-300">
              {t("fieldDetail.closes")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
              name="closeTime"
              onChange={handleFormChange}
              required
              type="time"
              value={fieldForm.closeTime}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-slate-300">
              {t("fieldDetail.facilities")}
            </span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
              name="facilities"
              onChange={handleFormChange}
              placeholder={t("admin.commaSeparatedPlaceholder")}
              type="text"
              value={fieldForm.facilities}
            />
          </label>

          <div className="sm:col-span-2">
            <AdminImageManager
              images={fieldForm.images}
              itemName={fieldForm.name || t("admin.fieldImageAlt")}
              onImagesChange={(images) =>
                setFieldForm((currentForm) => ({ ...currentForm, images }))
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
          {t("admin.loadingFields")}
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

      {!loading && !error && fields.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.noFields")}
        </div>
      ) : null}

      {!loading && !error && fields.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[1.1fr_1.1fr_0.8fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 xl:grid">
            <span>{t("common.name")}</span>
            <span>{t("common.location")}</span>
            <span>{t("common.fieldType")}</span>
            <span>{t("fieldCard.pricePerHour")}</span>
            <span>{t("fieldDetail.opens")}</span>
            <span>{t("fieldDetail.closes")}</span>
            <span>{t("common.statusLabel")}</span>
            <span>{t("common.action")}</span>
          </div>

          <div className="divide-y divide-white/10">
            {fields.map((field) => (
              <article
                className="grid gap-4 px-4 py-4 text-sm text-slate-300 xl:grid-cols-[1.1fr_1.1fr_0.8fr_0.8fr_0.7fr_0.7fr_0.8fr_0.8fr] xl:items-center"
                key={field._id}
              >
                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.name")}
                  </p>
                  <p className="font-black text-white">{field.name}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.location")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {field.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.fieldType")}
                  </p>
                  <p className="font-bold text-white">{field.fieldType}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("fieldCard.pricePerHour")}
                  </p>
                  <p className="font-bold text-lime">
                    {formatPrice(field.pricePerHour)} THB
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("fieldDetail.opens")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {field.openTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("fieldDetail.closes")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {field.closeTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.statusLabel")}
                  </p>
                  <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black text-lime">
                    {field.isActive === false
                      ? t("common.inactive")
                      : t("common.active")}
                  </span>
                </div>

                <div className="grid gap-2">
                  <button
                    className="rounded-md border border-lime/40 px-3 py-2 text-sm font-black text-lime transition hover:bg-lime hover:text-pitch"
                    onClick={() => openEditForm(field)}
                    type="button"
                  >
                    {t("admin.editField")}
                  </button>
                  <button
                    className="rounded-md border border-red-400/30 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                    disabled={deletingId === field._id}
                    onClick={() => handleDelete(field)}
                    type="button"
                  >
                    {deletingId === field._id
                      ? t("admin.deleting")
                      : t("admin.softDelete")}
                  </button>
                </div>

                <div className="xl:col-span-8">
                  <AdminImageManager
                    images={field.images}
                    itemName={field.name}
                    onSave={(images) => handleSaveImages(field, images)}
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

export default FieldAdmin;
