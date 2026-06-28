import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getSkillLabel, getStatusLabel } from "../utils/statusLabels.js";

const CommunityCard = ({ post }) => {
  const { t } = useLanguage();

  return (
    <article className="flex h-full flex-col rounded-lg border border-white/10 bg-card p-5 shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-lime/70 hover:shadow-lime/10">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-md border border-lime/40 bg-lime/10 px-2 py-1 text-xs font-black uppercase tracking-wide text-lime">
          {getSkillLabel(post.skillLevel, t)}
        </span>
        <span className="rounded-md border border-field/40 bg-field/10 px-2 py-1 text-xs font-bold capitalize text-slate-300">
          {getStatusLabel(post.status, t)}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-black text-white">{post.title}</h2>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        {post.location}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
        {post.description}
      </p>

      <div className="mt-auto grid gap-3 pt-5 text-sm text-slate-300">
        <div className="flex justify-between gap-4">
          <span className="text-muted">{t("communityCard.date")}</span>
          <span className="font-bold text-white">{post.matchDate}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">{t("communityCard.time")}</span>
          <span className="font-bold text-white">
            {post.startTime} - {post.endTime}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">{t("communityCard.players")}</span>
          <span className="font-bold text-lime">
            {post.currentPlayers} / {post.playersNeeded}
          </span>
        </div>
      </div>

      <Link
        className="mt-5 inline-flex w-full justify-center rounded-md bg-lime px-4 py-2.5 text-sm font-black uppercase tracking-wide text-pitch transition hover:bg-white"
        to={`/community/${post._id}`}
      >
        {t("common.viewDetails")}
      </Link>
    </article>
  );
};

export default CommunityCard;
