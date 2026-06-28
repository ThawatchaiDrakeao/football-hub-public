import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  addImageUrl,
  normalizeImageUrls,
  removeImageUrl,
} from "../utils/imageUrlManager.js";

const ImagePreview = ({ altText, imageUrl, onRemove }) => {
  const { t } = useLanguage();
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
      <div className="aspect-video bg-white/5">
        {!hasImageError ? (
          <img
            alt={altText}
            className="h-full w-full object-cover"
            onError={() => setHasImageError(true)}
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs font-semibold text-slate-500">
            {t("admin.brokenImagePreview")}
          </div>
        )}
      </div>
      <div className="grid gap-2 p-3">
        <p className="break-all text-xs text-slate-400">{imageUrl}</p>
        <button
          className="rounded-md border border-red-400/30 px-3 py-2 text-xs font-black text-red-200 transition hover:bg-red-500/10"
          onClick={onRemove}
          type="button"
        >
          {t("admin.removeImage")}
        </button>
      </div>
    </div>
  );
};

const AdminImageManager = ({
  allowMultiple = true,
  images,
  itemName,
  onImagesChange,
  onSave,
  showSaveButton = true,
}) => {
  const { t } = useLanguage();
  const [draftImages, setDraftImages] = useState(() =>
    normalizeImageUrls(images)
  );
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftImages(normalizeImageUrls(images));
  }, [images]);

  const handleAddImage = () => {
    const result = addImageUrl(draftImages, imageUrl, { allowMultiple });

    if (result.errorKey) {
      setError(t(result.errorKey));
      setMessage("");
      return;
    }

    setDraftImages(result.images);
    onImagesChange?.(result.images);
    setImageUrl("");
    setError("");
    setMessage("");
  };

  const handleRemoveImage = (nextImageUrl) => {
    const nextImages = removeImageUrl(draftImages, nextImageUrl);

    setDraftImages(nextImages);
    onImagesChange?.(nextImages);
    setMessage("");
    setError("");
  };

  const handleSaveImages = async () => {
    try {
      setSaving(true);
      setError("");
      await onSave?.(draftImages);
      setMessage(t("admin.imagesSaved"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || t("admin.imagesSaveError")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-lime/20 bg-lime/5 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex-1">
          <span className="text-sm font-black text-slate-200">
            {t("admin.imageUrl")}
          </span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://example.com/image.jpg"
            type="url"
            value={imageUrl}
          />
        </label>
        <button
          className="rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white"
          onClick={handleAddImage}
          type="button"
        >
          {t("admin.addImage")}
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
          {message}
        </p>
      ) : null}

      <div className="mt-4">
        <p className="text-sm font-black text-slate-200">
          {t("admin.imagePreview")}
        </p>

        {draftImages.length === 0 ? (
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
            {t("admin.noImages")}
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {draftImages.map((nextImageUrl) => (
              <ImagePreview
                altText={`${itemName} ${t("admin.imagePreview")}`}
                imageUrl={nextImageUrl}
                key={nextImageUrl}
                onRemove={() => handleRemoveImage(nextImageUrl)}
              />
            ))}
          </div>
        )}
      </div>

      {showSaveButton ? (
        <button
          className="mt-4 rounded-md border border-lime/40 px-4 py-3 text-sm font-black text-lime transition hover:bg-lime hover:text-pitch disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
          disabled={saving}
          onClick={handleSaveImages}
          type="button"
        >
          {saving ? t("admin.savingImages") : t("admin.saveImages")}
        </button>
      ) : null}
    </section>
  );
};

export default AdminImageManager;
