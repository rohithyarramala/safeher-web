"use client";
import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { BookOpen, Clock, X, ChevronRight, Search, Bookmark, Share2, PlayCircle } from "lucide-react";

// Production Data Structure with Content
const ARTICLES_DATA = [
  {
    id: 1,
    title: "How to prepare a rapid SOS plan",
    content: `
      An SOS plan is your blueprint for safety. 
      1. **Identify Contacts**: Choose 3 people who answer calls late at night.
      2. **Trigger Logic**: Decide exactly when you press the button (e.g., following a stranger for >2 mins).
      3. **Code Words**: Set a phrase that means "I am in danger" without alerting an aggressor.
    `,
    readTime: "6 min",
    category: "Preparedness",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Night commute checklist for urban routes",
    content: `
      Safety starts before you leave the building.
      - **Check Battery**: Never leave with less than 20%.
      - **Fake Call**: Keep your phone to your ear in dark alleys.
      - **Live Location**: Always trigger your SafeHer link before entering a cab.
    `,
    readTime: "4 min",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1519011985187-444d62641929?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Digital privacy basics every woman should know",
    content: `
      Protect your digital footprint. 
      - **Location Metadata**: Turn off EXIF data on photos.
      - **App Permissions**: Audit which apps have background microphone access.
      - **Two-Factor**: Enable 2FA on all social media immediately.
    `,
    readTime: "8 min",
    category: "Digital Safety",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Preparedness", "Travel", "Digital Safety", "Response"];

  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="user" />
      
      <main className="flex-1 p-4 md:p-8 md:ml-72 relative">
        
        {/* HEADER & SEARCH */}
        <section className="glass-shell rounded-[2.5rem] p-6 md:p-10 mb-8 border-2 border-white shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="text-[#b64f8f]" size={18} />
                <p className="text-[10px] font-black text-[#b64f8f] uppercase tracking-widest">SafeHer Academy</p>
              </div>
              <h1 className="text-4xl font-black text-[#4f336f] tracking-tight">Resource Library</h1>
            </div>

            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search safety guides..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#f2e8f5] bg-white focus:border-[#b64f8f] outline-none font-bold text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-[#4f336f] text-white shadow-lg' 
                  : 'bg-white text-[#7e5f97] border border-[#f2e8f5] hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              className="safeher-card group flex flex-col h-full bg-white border-2 border-white hover:border-[#f2e8f5] overflow-hidden transition-all shadow-xl shadow-purple-50/20"
            >
              <div className="h-48 w-full relative overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="safeher-pill safeher-pill-pink shadow-lg">{article.category}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-black text-[#4f336f] leading-tight mb-4 group-hover:text-[#b64f8f] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#f2e8f5]">
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-400">
                    <Clock size={12} /> {article.readTime} READ
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="ml-auto flex items-center gap-1 text-xs font-black text-[#b64f8f] uppercase tracking-tighter hover:gap-2 transition-all"
                  >
                    Open Guide <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ARTICLE OVERLAY (MODAL) */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#4f336f]/60 backdrop-blur-md" onClick={() => setSelectedArticle(null)}></div>
            
            <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur p-3 rounded-full text-[#4f336f] hover:bg-red-50 hover:text-red-500 transition-all shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="h-64 md:h-80 w-full relative">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-12">
                   <div className="text-white">
                      <span className="bg-[#b64f8f] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedArticle.category}</span>
                      <h2 className="text-3xl md:text-4xl font-black mt-4 leading-tight">{selectedArticle.title}</h2>
                   </div>
                </div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
                <div className="flex items-center gap-6 mb-8 text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-6">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-[#b64f8f]" /> {selectedArticle.readTime} Read</div>
                  <div className="flex items-center gap-2"><Bookmark size={16} /> Save Guide</div>
                  <div className="flex items-center gap-2"><Share2 size={16} /> Share</div>
                </div>

                <div className="prose prose-purple max-w-none">
                  <p className="text-lg text-[#5e3f82] leading-relaxed whitespace-pre-line font-medium">
                    {selectedArticle.content}
                  </p>
                </div>

                <div className="mt-12 p-6 bg-[#faf8ff] rounded-3xl border-2 border-dashed border-[#e8d4e5] flex items-center gap-4">
                   <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#b64f8f] shadow-sm">
                      <PlayCircle size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black text-[#4f336f] uppercase">Watch Video Summary</p>
                      <p className="text-[10px] font-bold text-gray-400">Available for Pro Members</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}