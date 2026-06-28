const PageShell = ({ title, description, children }) => {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 sm:p-6">
      <p className="mb-3 inline-flex rounded-md border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-lime">
        FOOTY HUB
      </p>
      <h1 className="break-words text-3xl font-black text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl break-words text-base leading-7 text-slate-300">
        {description}
      </p>
      {children ? <div className="mt-6 min-w-0">{children}</div> : null}
    </section>
  );
};

export default PageShell;
