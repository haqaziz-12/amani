"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Plus, Pencil, Trash2 } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
};

export default function FaqEditor() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; question: string; answer: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    setFaqs((data as FaqItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.question.trim()) {
      setMessage("Error: Question is required");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      if (editing.id) {
        const { error } = await supabase.from("faqs").update({
          question: editing.question,
          answer: editing.answer,
        } as any).eq("id", editing.id);
        if (error) throw error;
        setMessage("FAQ updated!");
      } else {
        const { error } = await supabase.from("faqs").insert({
          question: editing.question,
          answer: editing.answer,
          sort_order: faqs.length + 1,
          is_published: true,
        } as any);
        if (error) throw error;
        setMessage("FAQ created!");
      }
      setEditing(null);
      load();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold text-brand-dark">FAQ Management</h2>
        <button
          onClick={() => setEditing({ question: "", answer: "" })}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-red-dark"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}

      {editing && (
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-brand-dark">{editing.id ? "Edit FAQ" : "New FAQ"}</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              value={editing.question}
              onChange={(e) => setEditing({ ...editing, question: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer</label>
            <textarea
              value={editing.answer}
              onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm border border-border">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>
      ) : faqs.length === 0 ? (
        <p className="text-brand-muted text-center py-8">No FAQs yet. Click Add FAQ to create one.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-border p-4 flex justify-between gap-4">
              <div>
                <p className="font-medium text-brand-dark">{f.question}</p>
                <p className="text-sm text-brand-muted mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing({ id: f.id, question: f.question, answer: f.answer })}
                  className="p-2 text-brand-muted hover:text-brand-red"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(f.id)} className="p-2 text-brand-muted hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
