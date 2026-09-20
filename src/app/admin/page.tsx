"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Lock, Image as ImageIcon, Package, FileText, LayoutDashboard,
  Settings, HelpCircle, LogOut, Loader2, Upload, CheckCircle2, X,
  Plus, Pencil, Trash2, Save,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

type Tab = "dashboard" | "logo-hero" | "products" | "about" | "services" | "craftsmanship" | "faq";

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  size: string | null;
  quality: string | null;
  materials: string | null;
  description: string | null;
  washing_type: string | null;
  collection: string | null;
  price_note: string | null;
  image_front: string | null;
  image_back: string | null;
  image_detail: string | null;
  is_published: boolean;
};

const emptyProduct = {
  name: "",
  slug: "",
  size: "",
  quality: "",
  materials: "",
  description: "",
  washing_type: "",
  collection: "",
  price_note: "Price on Enquiry",
  image_front: "",
  image_back: "",
  image_detail: "",
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<DbProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [editingProduct, setEditingProduct] = useState<(typeof emptyProduct & { id?: string }) | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadSettings();
        loadProducts();
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("logo_url, hero_image_url").limit(1).maybeSingle();
    if (data) {
      setLogoUrl(data.logo_url);
      setHeroUrl(data.hero_image_url);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError("");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      setProductsError(`Load error: ${error.message} (code: ${error.code})`);
      setProducts([]);
    } else {
      setProducts((data as DbProduct[]) || []);
      if (!data || data.length === 0) {
        setProductsError("Query succeeded but returned 0 products. Check Table Editor in Supabase.");
      }
    }
    setProductsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setSubmitting(false); return; }
    setSubmitting(false);
    loadSettings();
    loadProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTab("dashboard");
  };

  const uploadFile = async (
    file: File, bucket: "logos" | "heroes",
    setUploading: (v: boolean) => void, setUrl: (url: string) => void,
    column: "logo_url" | "hero_image_url"
  ) => {
    setUploading(true);
    setUploadMessage("");
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${column}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const publicUrl = publicData.publicUrl;

      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
      if (existing?.id) {
        if (column === "logo_url") {
          await supabase.from("site_settings").update({ logo_url: publicUrl, updated_at: new Date().toISOString() } as any).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").update({ hero_image_url: publicUrl, updated_at: new Date().toISOString() } as any).eq("id", existing.id);
        }
      } else {
        if (column === "logo_url") await supabase.from("site_settings").insert({ logo_url: publicUrl } as any);
        else await supabase.from("site_settings").insert({ hero_image_url: publicUrl } as any);
      }
      setUrl(publicUrl);
      setUploadMessage("Uploaded successfully!");
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err: any) {
      setUploadMessage(`Error: ${err.message || "Upload failed"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "logos", setUploadingLogo, setLogoUrl, "logo_url");
  };
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "heroes", setUploadingHero, setHeroUrl, "hero_image_url");
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const saveProduct = async () => {
    if (!editingProduct || !editingProduct.name) {
      setProductMessage("Error: Name is required");
      return;
    }
    setSavingProduct(true);
    setProductMessage("");
    try {
      const slug = editingProduct.slug || slugify(editingProduct.name);
      const payload = {
        name: editingProduct.name,
        slug,
        size: editingProduct.size || null,
        quality: editingProduct.quality || null,
        materials: editingProduct.materials || null,
        description: editingProduct.description || null,
        washing_type: editingProduct.washing_type || null,
        collection: editingProduct.collection || null,
        price_note: editingProduct.price_note || "Price on Enquiry",
        image_front: editingProduct.image_front || null,
        image_back: editingProduct.image_back || null,
        image_detail: editingProduct.image_detail || null,
        is_published: true,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct.id) {
        const { error } = await supabase.from("products").update(payload as any).eq("id", editingProduct.id);
        if (error) throw error;
        setProductMessage("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(payload as any);
        if (error) throw error;
        setProductMessage("Product created!");
      }
      setEditingProduct(null);
      loadProducts();
      setTimeout(() => setProductMessage(""), 3000);
    } catch (err: any) {
      setProductMessage(`Error: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) setProductMessage(`Error: ${error.message}`);
    else {
      setProductMessage("Product deleted");
      loadProducts();
      setTimeout(() => setProductMessage(""), 3000);
    }
  };

  const uploadProductImage = async (file: File, field: "image_front" | "image_back" | "image_detail") => {
    if (!editingProduct) return;
    setUploadingImage(field);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `product-${field}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);
      setEditingProduct({ ...editingProduct, [field]: data.publicUrl });
    } catch (err: any) {
      setProductMessage(`Error: ${err.message}`);
    } finally {
      setUploadingImage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-brand-red" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-center text-brand-dark mb-2">Admin Login</h1>
          <p className="text-center text-sm text-brand-muted mb-6">Sign in with your Supabase admin account</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-red" required />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full bg-brand-red text-white font-semibold py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold text-brand-dark">Khalaj Amani Admin</h1>
          <p className="text-xs text-brand-muted">{user.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-red">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="container-wide py-8 px-4">
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
            { id: "logo-hero" as Tab, label: "Logo & Hero", icon: ImageIcon },
            { id: "products" as Tab, label: "Products", icon: Package },
            { id: "about" as Tab, label: "About", icon: FileText },
            { id: "services" as Tab, label: "Services", icon: Settings },
            { id: "craftsmanship" as Tab, label: "Craftsmanship", icon: Settings },
            { id: "faq" as Tab, label: "FAQ", icon: HelpCircle },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === "products") loadProducts(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-brand-red text-white" : "bg-white text-brand-dark border border-border hover:bg-muted"
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ImageIcon, title: "Logo & Hero", desc: "Upload logo and hero image", tab: "logo-hero" as Tab },
              { icon: Package, title: "Products", desc: "Add, edit, delete products + images", tab: "products" as Tab },
              { icon: FileText, title: "About", desc: "Edit About page", tab: "about" as Tab },
              { icon: LayoutDashboard, title: "Services", desc: "Edit Services", tab: "services" as Tab },
              { icon: Settings, title: "Craftsmanship", desc: "Edit Craftsmanship", tab: "craftsmanship" as Tab },
              { icon: HelpCircle, title: "FAQ", desc: "Manage FAQs", tab: "faq" as Tab },
            ].map((item) => (
              <button key={item.title} onClick={() => setActiveTab(item.tab)}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm text-left hover:shadow-md transition-shadow">
                <item.icon className="w-8 h-8 text-brand-red mb-3" />
                <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">{item.title}</h2>
                <p className="text-sm text-brand-muted">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {activeTab === "logo-hero" && (
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm max-w-3xl">
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">Logo & Hero Image</h2>
            {uploadMessage && (
              <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                uploadMessage.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}>
                {uploadMessage.startsWith("Error") ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {uploadMessage}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Website Logo</h3>
                <div className="aspect-square bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-4 overflow-hidden">
                  {logoUrl ? <Image src={logoUrl} alt="Logo" width={200} height={200} className="object-contain" unoptimized /> :
                    <div className="text-center text-brand-muted text-sm"><ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />No logo yet</div>}
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <button onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-medium py-3 rounded-lg hover:bg-brand-red-dark disabled:opacity-60">
                  {uploadingLogo ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Logo</>}
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark mb-3">Hero Image</h3>
                <div className="aspect-video bg-muted rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-4 overflow-hidden">
                  {heroUrl ? <Image src={heroUrl} alt="Hero" width={400} height={225} className="object-cover w-full h-full" unoptimized /> :
                    <div className="text-center text-brand-muted text-sm"><ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />No hero yet</div>}
                </div>
                <input ref={heroInputRef} type="file" accept="image/*" onChange={handleHeroChange} className="hidden" />
                <button onClick={() => heroInputRef.current?.click()} disabled={uploadingHero}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red text-white font-medium py-3 rounded-lg hover:bg-brand-red-dark disabled:opacity-60">
                  {uploadingHero ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Hero</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Products</h2>
              <div className="flex gap-2">
                <button onClick={loadProducts}
                  className="flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted">
                  Refresh
                </button>
                <button onClick={() => setEditingProduct({ ...emptyProduct })}
                  className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-red-dark">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
            </div>

            {productsError && (
              <div className="px-4 py-3 rounded-lg text-sm bg-amber-50 text-amber-800 border border-amber-200">
                {productsError}
              </div>
            )}

            {productMessage && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                productMessage.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}>{productMessage}</div>
            )}

            {editingProduct && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">{editingProduct.id ? "Edit Product" : "New Product"}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value, slug: slugify(e.target.value) })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input value={editingProduct.slug} onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Size</label>
                    <input value={editingProduct.size} onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quality</label>
                    <input value={editingProduct.quality} onChange={(e) => setEditingProduct({ ...editingProduct, quality: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Materials</label>
                    <input value={editingProduct.materials} onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Collection</label>
                    <input value={editingProduct.collection} onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Washing Type</label>
                    <input value={editingProduct.washing_type} onChange={(e) => setEditingProduct({ ...editingProduct, washing_type: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price Note</label>
                    <input value={editingProduct.price_note} onChange={(e) => setEditingProduct({ ...editingProduct, price_note: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={4} className="w-full px-3 py-2 border border-border rounded-lg" />
                  </div>

                  {(["image_front", "image_back", "image_detail"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">{field.replace("image_", "")} Image</label>
                      {editingProduct[field] && (
                        <Image src={editingProduct[field]} alt={field} width={120} height={90} className="rounded mb-2 object-cover" unoptimized />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadProductImage(f, field);
                      }} className="text-sm" />
                      {uploadingImage === field && <p className="text-xs text-brand-muted mt-1">Uploading...</p>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={saveProduct} disabled={savingProduct}
                    className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-red-dark disabled:opacity-60">
                    {savingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingProduct.id ? "Update" : "Create"}
                  </button>
                  <button onClick={() => setEditingProduct(null)}
                    className="px-5 py-2.5 rounded-lg border border-border text-brand-dark hover:bg-muted">Cancel</button>
                </div>
              </div>
            )}

            {productsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand-red" /></div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-8 text-center text-brand-muted">
                No products loaded.
                <p className="text-xs mt-2">Use the Refresh button or check the yellow message above for details.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <p className="px-4 py-2 text-xs text-brand-muted bg-muted/30">{products.length} products found</p>
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Collection</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Size</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-brand-muted">{p.collection}</td>
                        <td className="px-4 py-3 hidden sm:table-cell text-brand-muted">{p.size}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setEditingProduct({
                            id: p.id, name: p.name, slug: p.slug, size: p.size || "", quality: p.quality || "",
                            materials: p.materials || "", description: p.description || "", washing_type: p.washing_type || "",
                            collection: p.collection || "", price_note: p.price_note || "Price on Enquiry",
                            image_front: p.image_front || "", image_back: p.image_back || "", image_detail: p.image_detail || "",
                          })} className="p-2 text-brand-muted hover:text-brand-red"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteProduct(p.id)} className="p-2 text-brand-muted hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(activeTab === "about" || activeTab === "services" || activeTab === "craftsmanship" || activeTab === "faq") && (
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center">
            <FileText className="w-12 h-12 text-brand-red mx-auto mb-4 opacity-60" />
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
            <p className="text-brand-muted">Coming in the next update.</p>
          </div>
        )}
      </div>
    </div>
  );
}
