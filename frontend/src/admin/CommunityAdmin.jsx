import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getSkillLabel, getStatusLabel } from "../utils/statusLabels.js";
import { closeCommunityPost, getCommunityPostsAdmin } from "./adminApi.js";

const getPostOwner = (post, t) => {
  if (typeof post.user === "object" && post.user) {
    return post.user.email || post.user.name || t("common.unknownOwner");
  }

  return t("common.unknownOwner");
};

const CommunityAdmin = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCommunityPostsAdmin();
      setPosts(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.loadCommunityError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleClose = async (post) => {
    const confirmed = window.confirm(
      `${t("admin.confirmClosePost")} "${post.title}"? ${t(
        "admin.confirmClosePostSuffix"
      )}`
    );

    if (!confirmed) return;

    try {
      setClosingId(post._id);
      setError("");
      setMessage("");

      const closedPost = await closeCommunityPost(post._id);
      setPosts((currentPosts) => {
        return currentPosts.map((item) =>
          item._id === post._id ? { ...item, ...closedPost, status: "closed" } : item
        );
      });
      setMessage(t("admin.postClosed"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("admin.closePostError")
      );
    } finally {
      setClosingId("");
    }
  };

  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">
            {t("admin.communityTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("admin.communityDescription")}
          </p>
        </div>
        <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
          {posts.length} {t("admin.count.posts")}
        </span>
      </div>

      {loading ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.loadingCommunity")}
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

      {!loading && !error && posts.length === 0 ? (
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
          {t("admin.noCommunity")}
        </div>
      ) : null}

      {!loading && !error && posts.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-3 bg-white/[0.04] px-4 py-3 text-xs font-black uppercase text-slate-500 xl:grid">
            <span>{t("common.title")}</span>
            <span>{t("common.owner")}</span>
            <span>{t("common.location")}</span>
            <span>{t("common.date")}</span>
            <span>{t("common.players")}</span>
            <span>{t("common.skillLevel")}</span>
            <span>{t("common.statusLabel")}</span>
            <span>{t("common.action")}</span>
          </div>

          <div className="divide-y divide-white/10">
            {posts.map((post) => (
              <article
                className="grid gap-4 px-4 py-4 text-sm text-slate-300 xl:grid-cols-[1.2fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.7fr_0.8fr] xl:items-center"
                key={post._id}
              >
                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.title")}
                  </p>
                  <p className="font-black text-white">{post.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.startTime} - {post.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.owner")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {getPostOwner(post, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.location")}
                  </p>
                  <p className="font-semibold text-slate-200">
                    {post.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.date")}
                  </p>
                  <p className="font-bold text-white">{post.matchDate}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.players")}
                  </p>
                  <p className="font-bold text-lime">
                    {post.currentPlayers}/{post.playersNeeded}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.skillLevel")}
                  </p>
                  <p className="font-semibold capitalize text-slate-200">
                    {getSkillLabel(post.skillLevel, t)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-slate-500 xl:hidden">
                    {t("common.statusLabel")}
                  </p>
                  <span className="inline-flex rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-black capitalize text-lime">
                    {getStatusLabel(post.status, t)}
                  </span>
                </div>

                <button
                  className="rounded-md border border-red-400/30 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                  disabled={closingId === post._id || post.status === "closed"}
                  onClick={() => handleClose(post)}
                  type="button"
                >
                  {closingId === post._id
                    ? t("admin.closing")
                    : t("admin.closePost")}
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default CommunityAdmin;
