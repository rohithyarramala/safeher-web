"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Plus, Pencil, Trash2, Loader2, BookOpen, Search, ExternalLink, Calendar } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase.from("safety_content").select("*").eq("type", "ARTICLE").order("created_at", { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;
    const { error } = await supabase.from("safety_content").delete().eq("id", id);
    if (!error) setArticles(articles.filter(a => a.id !== id));
  };

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* HEADER */}
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">Library Index</h1>
            <p className="text-[#7e5f97] font-medium">You have {articles.length} published safety guides.</p>
          </div>
          <Link href="/admin/articles/new" className="bg-[#4f336f] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
            <Plus size={20} /> CREATE ARTICLE
          </Link>
        </section>

        {/* SEARCH BAR */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search by title..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-white rounded-2xl shadow-sm outline-none focus:border-[#4f336f] font-bold text-[#4f336f]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST GRID */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4f336f]" size={40} /></div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((art) => (
              <div key={art.id} className="safeher-card p-6 bg-white flex flex-col md:flex-row justify-between items-center group hover:border-[#4f336f]/20 transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                   {art.image_url ? (
                     <img src={art.image_url} className="w-16 h-16 rounded-xl object-cover border" alt="" />
                   ) : (
                     <div className="w-16 h-16 rounded-xl bg-[#faf8ff] flex items-center justify-center text-gray-300"><BookOpen /></div>
                   )}
                   <div>
                     <h2 className="font-black text-[#4f336f] text-lg leading-tight">{art.title}</h2>
                     <div className="flex gap-4 mt-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><Calendar size={12}/> {new Date(art.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] font-black text-[#b64f8f] uppercase">Article ID: {art.id.slice(0,8)}</p>
                     </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <Link href={`/admin/articles/edit/${art.id}`} className="p-3 bg-purple-50 text-[#4f336f] rounded-xl hover:bg-[#4f336f] hover:text-white transition-all">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => deleteArticle(art.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                  <a href="/articles" target="_blank" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-200 transition-all">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}