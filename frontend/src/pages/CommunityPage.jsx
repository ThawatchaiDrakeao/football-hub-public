import { useEffect, useState } from "react";
import {
  createCommunityPost,
  getCommunityPosts,
} from "../api/communityApi.js";
import CommunityCard from "../components/CommunityCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import PageShell from "./PageShell.jsx";

const skillLevels = [
  { labelKey: "community.allSkills", value: "" },
  { labelKey: "common.skill.beginner", value: "beginner" },
  { labelKey: "common.skill.casual", value: "casual" },
  { labelKey: "common.skill.intermediate", value: "intermediate" },
  { labelKey: "common.skill.competitive", value: "competitive" },
];

const statuses = [
  { labelKey: "community.allStatuses", value: "" },
  { labelKey: "common.status.open", value: "open" },
  { labelKey: "common.status.full", value: "full" },
  { labelKey: "common.status.closed", value: "closed" },
];

const initialForm = {
  title: "",
  description: "",
  location: "",
  matchDate: "",
  startTime: "",
  endTime: "",
  playersNeeded: 10,
  skillLevel: "casual",
};

const CommunityPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (skillLevel) params.skillLevel = skillLevel;
      if (status) params.status = status;

      const data = await getCommunityPosts(params);
      setPosts(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("community.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPostsSafely = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};
        if (search.trim()) params.search = search.trim();
        if (skillLevel) params.skillLevel = skillLevel;
        if (status) params.status = status;

        const data = await getCommunityPosts(params);

        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("community.loadError")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPostsSafely();

    return () => {
      isMounted = false;
    };
  }, [search, skillLevel, status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: name === "playersNeeded" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.matchDate ||
      !form.startTime ||
      !form.endTime
    ) {
      return t("community.requiredError");
    }

    if (form.startTime >= form.endTime) {
      return t("community.timeOrderError");
    }

    if (!Number.isFinite(form.playersNeeded) || form.playersNeeded < 2) {
      return t("community.playersError");
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setCreating(true);
      setFormError("");
      setSuccessMessage("");

      await createCommunityPost(form);
      setForm(initialForm);
      setSuccessMessage(t("community.success"));
      await loadPosts();
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          t("community.createError")
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageShell
      title={t("community.title")}
      description={t("community.description")}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.search")}
          </span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("community.searchPlaceholder")}
            type="search"
            value={search}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.skillLevel")}
          </span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
            onChange={(event) => setSkillLevel(event.target.value)}
            value={skillLevel}
          >
            {skillLevels.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-300">
            {t("common.statusLabel")}
          </span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="mt-8 rounded-lg border border-white/10 bg-black/20 p-5">
        <h2 className="text-xl font-black text-white">
          {t("community.createTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {t("community.createDescription")}
        </p>

        {!isAuthenticated ? (
          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4 text-slate-300">
            {t("community.loginRequiredCreate")}
          </div>
        ) : (
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-slate-300">
                {t("common.title")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                name="title"
                onChange={handleChange}
                placeholder={t("community.postTitlePlaceholder")}
                required
                type="text"
                value={form.title}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-slate-300">
                {t("common.description")}
              </span>
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                name="description"
                onChange={handleChange}
                placeholder={t("community.descriptionPlaceholder")}
                required
                value={form.description}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("common.location")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                name="location"
                onChange={handleChange}
                placeholder={t("community.locationPlaceholder")}
                required
                type="text"
                value={form.location}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("common.date")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                name="matchDate"
                onChange={handleChange}
                required
                type="date"
                value={form.matchDate}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("common.startTime")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                name="startTime"
                onChange={handleChange}
                required
                type="time"
                value={form.startTime}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("common.endTime")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                name="endTime"
                onChange={handleChange}
                required
                type="time"
                value={form.endTime}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("community.playersNeeded")}
              </span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                min="2"
                name="playersNeeded"
                onChange={handleChange}
                required
                type="number"
                value={form.playersNeeded}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-300">
                {t("common.skillLevel")}
              </span>
              <select
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-lime"
                name="skillLevel"
                onChange={handleChange}
                value={form.skillLevel}
              >
                {skillLevels
                  .filter((item) => item.value)
                  .map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(item.labelKey)}
                    </option>
                  ))}
              </select>
            </label>

            {formError ? (
              <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 sm:col-span-2">
                {formError}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime sm:col-span-2">
                {successMessage}
              </p>
            ) : null}

            <button
              className="rounded-md bg-lime px-5 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 sm:col-span-2"
              disabled={creating}
              type="submit"
            >
              {creating ? t("community.creating") : t("community.createButton")}
            </button>
          </form>
        )}
      </section>

      {loading ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("community.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && posts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("community.empty")}
        </div>
      ) : null}

      {!loading && !error && posts.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <CommunityCard key={post._id} post={post} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
};

export default CommunityPage;
