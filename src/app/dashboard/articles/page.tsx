import Sidebar from "@/components/Sidebar";

const articles = [
  {
    title: "How to prepare a rapid SOS plan",
    readTime: "6 min",
    category: "Preparedness",
    source: "SafeHer Editorial",
  },
  {
    title: "Night commute checklist for urban routes",
    readTime: "4 min",
    category: "Travel",
    source: "Safety Bureau",
  },
  {
    title: "Digital privacy basics every woman should know",
    readTime: "8 min",
    category: "Digital Safety",
    source: "Cyber Watch",
  },
  {
    title: "When to escalate and how to document incidents",
    readTime: "7 min",
    category: "Response",
    source: "Emergency Team",
  },
];

export default function ArticlesPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar variant="user" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-indigo mb-3">
            Knowledge Center
          </p>
          <h1 className="text-3xl font-black text-[#4f336f]">
            Articles & Resources
          </h1>
          <p className="text-[#7e5f97] mt-1">
            Actionable guides for preparedness, response, and long-term personal
            safety.
          </p>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {articles.map((article) => (
            <article key={article.title} className="safeher-card p-5">
              <span className="safeher-pill safeher-pill-pink mb-4">
                {article.category}
              </span>
              <h2 className="text-lg font-black text-[#5f3f81] leading-snug">
                {article.title}
              </h2>
              <p className="text-sm text-[#7e5f97] mt-4">
                Source: {article.source}
              </p>
              <p className="text-sm text-[#946ca3] mt-1">
                Read time: {article.readTime}
              </p>
              <button className="mt-4 rounded-lg border border-[#e8d4e5] bg-white px-3 py-2 text-sm font-bold text-[#7a5a94] hover:bg-[#fff4fa]">
                Read article
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
