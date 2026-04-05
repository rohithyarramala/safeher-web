"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Save, ChevronLeft, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnBulletList, BtnLink, BtnClearFormatting, BtnRedo, BtnUndo } from "react-simple-wysiwyg";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ArticleEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", image_url: "" });

  useEffect(() => {
    if (id) {
      const fetchArt = async () => {
        const { data } = await supabase.from("safety_content").select("*").eq("id", id).single();
        if (data) setFormData({ title: data.title, content: data.content, image_url: data.image_url || "" });
        setLoading(false);
      };
      fetchArt();
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = { ...formData, type: "ARTICLE" };
    const { error } = id 
      ? await supabase.from("safety_content").update(payload).eq("id", id)
      : await supabase.from("safety_content").insert([payload]);

    if (!error) router.push("/admin/articles");
    setSaving(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#faf8ff]"><Loader2 className="animate-spin text-[#4f336f]" size={40}/></div>;

  return (
    <div className="safeher-page md:flex bg-[#faf8ff] min-h-screen">
      <Sidebar variant="admin" />
      <main className="flex-1 p-4 md:p-8 md:ml-72">
        
        {/* NAV HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#7e5f97] font-bold hover:text-[#4f336f] transition-colors">
            <ChevronLeft size={20}/> Back to Index
          </button>
          <div className="flex items-center gap-4">
             {saving && <span className="text-[10px] font-black text-[#b64f8f] animate-pulse uppercase tracking-widest">Syncing to Vault...</span>}
             <button onClick={handleSave} className="bg-[#4f336f] text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-purple-100 hover:bg-[#3a2652]">
                <Save size={18}/> {id ? "UPDATE GUIDE" : "PUBLISH GUIDE"}
             </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <section className="safeher-card p-8 bg-white border-2 border-white shadow-2xl">
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Article Headline</label>
                   <input 
                    className="w-full p-5 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-2xl outline-none focus:border-[#4f336f] font-black text-2xl text-[#4f336f]"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="E.g. 5 Steps to stay safe during night travel"
                   />
                </div>

                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Cover Image URL</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                      <input 
                        className="w-full pl-14 pr-5 py-4 bg-[#faf8ff] border-2 border-[#f2e8f5] rounded-2xl outline-none focus:border-[#4f336f] font-bold"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                      />
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rich Content</label>
                   <EditorProvider>
                    <div className="border-2 border-[#f2e8f5] rounded-3xl overflow-hidden bg-[#faf8ff]">
                      <Toolbar className="bg-white border-b border-[#f2e8f5] p-3 flex gap-1">
                        <BtnBold /> <BtnItalic /> <BtnBulletList /> <BtnLink /> <BtnClearFormatting />
                      </Toolbar>
                      <Editor
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="p-6 min-h-[400px] outline-none text-[#5e3f82] leading-relaxed"
                      />
                    </div>
                  </EditorProvider>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}