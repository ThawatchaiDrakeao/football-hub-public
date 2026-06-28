import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  acceptJoinRequest,
  getCommunityPostById,
  getJoinRequests,
  joinCommunityPost,
  rejectJoinRequest,
} from "../api/communityApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getSkillLabel, getStatusLabel } from "../utils/statusLabels.js";
import PageShell from "./PageShell.jsx";

const getUserId = (userLike) => {
  if (!userLike) return "";
  if (typeof userLike === "string") return userLike;
  return userLike._id || userLike.id || "";
};

const CommunityDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [post, setPost] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [requestsError, setRequestsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const currentUserId = getUserId(user);
  const ownerId = getUserId(post?.user);
  const isOwner = currentUserId && ownerId && currentUserId === ownerId;
  const canManageRequests = isOwner || user?.role === "admin";
  const isJoinDisabled = post?.status === "full" || post?.status === "closed";

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCommunityPostById(id);
      setPost(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          t("communityDetail.loadError")
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadJoinRequests = useCallback(async () => {
    if (!canManageRequests) return;

    try {
      setRequestsLoading(true);
      setRequestsError("");
      const data = await getJoinRequests(id);
      setJoinRequests(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setRequestsError(
        requestError.response?.data?.message ||
          t("communityDetail.requestsError")
      );
    } finally {
      setRequestsLoading(false);
    }
  }, [canManageRequests, id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    loadJoinRequests();
  }, [loadJoinRequests]);

  const handleJoin = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setJoinError(t("communityDetail.loginRequired"));
      return;
    }

    if (isOwner) {
      setJoinError(t("communityDetail.ownPostError"));
      return;
    }

    if (isJoinDisabled) {
      setJoinError(t("communityDetail.closedError"));
      return;
    }

    try {
      setJoinLoading(true);
      setJoinError("");
      setSuccessMessage("");

      await joinCommunityPost(id, message);
      setMessage("");
      setSuccessMessage(t("communityDetail.success"));
    } catch (requestError) {
      setJoinError(
        requestError.response?.data?.message ||
          t("communityDetail.joinError")
      );
    } finally {
      setJoinLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      setActionLoadingId(requestId);
      setRequestsError("");

      if (action === "accept") {
        await acceptJoinRequest(requestId);
      } else {
        await rejectJoinRequest(requestId);
      }

      await loadPost();
      await loadJoinRequests();
    } catch (requestError) {
      setRequestsError(
        requestError.response?.data?.message ||
          t("communityDetail.updateRequestError")
      );
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <PageShell
      title={t("communityDetail.title")}
      description={t("communityDetail.description")}
    >
      {loading ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-slate-300">
          {t("communityDetail.loading")}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : null}

      {!loading && !error && post ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-lg border border-white/10 bg-black/25 p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-lime/30 bg-lime/10 px-2 py-1 text-xs font-bold uppercase text-lime">
                {getSkillLabel(post.skillLevel, t)}
              </span>
              <span className="rounded-md border border-white/10 px-2 py-1 text-xs font-bold capitalize text-slate-300">
                {getStatusLabel(post.status, t)}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-black text-white">
              {post.title}
            </h2>
            <p className="mt-2 text-sm font-bold text-slate-300">
              {post.location}
            </p>
            <p className="mt-4 leading-7 text-slate-300">
              {post.description}
            </p>

            <div className="mt-6 grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.date")}
                </p>
                <p className="text-lg font-black text-white">
                  {post.matchDate}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.time")}
                </p>
                <p className="text-lg font-black text-white">
                  {post.startTime} - {post.endTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.players")}
                </p>
                <p className="text-lg font-black text-lime">
                  {post.currentPlayers} / {post.playersNeeded}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {t("common.owner")}
                </p>
                <p className="text-lg font-black text-white">
                  {post.user?.name || t("communityDetail.matchOwner")}
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-lime/20 bg-lime/10 p-5">
            <h2 className="text-xl font-black text-white">
              {t("communityDetail.joinTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {t("communityDetail.joinDescription")}
            </p>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4 text-slate-300">
                <p>{t("communityDetail.loginRequired")}</p>
                <Link
                  className="mt-4 inline-flex rounded-md bg-lime px-4 py-2 text-sm font-black text-pitch transition hover:bg-white"
                  to="/login"
                >
                  {t("common.login")}
                </Link>
              </div>
            ) : (
              <form className="mt-5 space-y-4" onSubmit={handleJoin}>
                <label className="block">
                  <span className="text-sm font-bold text-slate-300">
                    {t("communityDetail.message")}
                  </span>
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime"
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={t("communityDetail.messagePlaceholder")}
                    value={message}
                  />
                </label>

                {joinError ? (
                  <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
                    {joinError}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="rounded-md border border-lime/30 bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
                    {successMessage}
                  </p>
                ) : null}

                <button
                  className="w-full rounded-md bg-lime px-4 py-3 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  disabled={joinLoading || isOwner || isJoinDisabled}
                  type="submit"
                >
                  {joinLoading
                    ? t("communityDetail.sending")
                    : t("communityDetail.joinButton")}
                </button>
              </form>
            )}
          </aside>

          {canManageRequests ? (
            <section className="rounded-lg border border-white/10 bg-black/25 p-5 lg:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">
                    {t("communityDetail.requestsTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {t("communityDetail.requestsDescription")}
                  </p>
                </div>
                <span className="rounded-md border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-black text-lime">
                  {joinRequests.length} {t("communityDetail.requestsCount")}
                </span>
              </div>

              {requestsLoading ? (
                <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                  {t("communityDetail.loadingRequests")}
                </div>
              ) : null}

              {requestsError ? (
                <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-200">
                  {requestsError}
                </div>
              ) : null}

              {!requestsLoading &&
              !requestsError &&
              joinRequests.length === 0 ? (
                <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-5 text-slate-300">
                  {t("communityDetail.noRequests")}
                </div>
              ) : null}

              {!requestsLoading &&
              !requestsError &&
              joinRequests.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {joinRequests.map((request) => (
                    <article
                      className="rounded-lg border border-white/10 bg-black/20 p-4"
                      key={request._id}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-black text-white">
                            {request.user?.name || t("communityDetail.player")}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {request.message || t("communityDetail.noMessage")}
                          </p>
                          <span className="mt-3 inline-flex rounded-md border border-white/10 px-2 py-1 text-xs font-black capitalize text-slate-300">
                            {getStatusLabel(request.status, t)}
                          </span>
                        </div>

                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              className="rounded-md bg-lime px-3 py-2 text-sm font-black text-pitch transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                              disabled={actionLoadingId === request._id}
                              onClick={() =>
                                handleRequestAction(request._id, "accept")
                              }
                              type="button"
                            >
                              {t("communityDetail.accept")}
                            </button>
                            <button
                              className="rounded-md border border-red-400/30 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                              disabled={actionLoadingId === request._id}
                              onClick={() =>
                                handleRequestAction(request._id, "reject")
                              }
                              type="button"
                            >
                              {t("communityDetail.reject")}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
};

export default CommunityDetailPage;
