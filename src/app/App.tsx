import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, Search, ShoppingBag, Heart, ArrowRight, ArrowLeft,
  ArrowUpRight, ChevronDown, ChevronUp, Check, Star, Minus, Plus,
  MapPin, CreditCard, Truck, Package, Instagram, Twitter, SlidersHorizontal,
  Trash2, Lock, ChevronRight
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type View = "home" | "shop" | "product" | "wishlist" | "checkout" | "confirmation";
type CheckoutStep = 1 | 2 | 3;
interface Product {
  id: string; name: string; subtitle: string; category: string;
  price: number; originalPrice?: number; tag?: string;
  sizes: string[]; colors: string[];
  images: string[]; description: string; material: string; origin: string;
  rating: number; reviews: number;
}
interface CartItem { product: Product; size: string; color: string; qty: number; }

// ─── PRODUCTS DATA ────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Ivory Column Dress", subtitle: "Eveningwear · AW 2025",
    category: "Eveningwear", price: 1840, originalPrice: 2200, tag: "Sale",
    sizes: ["XS","S","M","L","XL"], colors: ["Ivory","Obsidian"],
    images: [
      "https://images.unsplash.com/photo-1659522761084-79196b64abe4?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1535735798140-0659d97a5b6d?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Fluid-weight matte crepe. An architectural column silhouette with a deep-v back and bias-cut hem. Natural ivory dye. Concealed side zip. Fully lined in silk.",
    material: "100% Matte Crepe (Viscose)", origin: "Made in Italy", rating: 4.9, reviews: 48,
  },
  {
    id: "p2", name: "Obsidian Evening Gown", subtitle: "Signature Series · AW 2025",
    category: "Eveningwear", price: 2100, tag: "Limited",
    sizes: ["XS","S","M","L"], colors: ["Obsidian"],
    images: [
      "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1767049603596-79204ada5273?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Deep black silk charmeuse pooling at the floor. A corseted bodice with boning and adjustable lacing at the back. Draped train. The centrepiece of any archive.",
    material: "100% Silk Charmeuse", origin: "Made in France", rating: 5.0, reviews: 22,
  },
  {
    id: "p3", name: "Noir Structured Coat", subtitle: "Outerwear · AW 2025",
    category: "Outerwear", price: 2800, tag: "New",
    sizes: ["XS","S","M","L","XL"], colors: ["Noir","Slate"],
    images: [
      "https://images.unsplash.com/photo-1551113006-731674fbb3ff?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1663343683182-70885ae0a792?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Double-faced wool melton in deep noir. Architectural shoulder seams. Hidden press-stud closure beneath a wrapped front. Floor-sweeping hem.",
    material: "100% Wool Melton", origin: "Made in England", rating: 4.8, reviews: 34,
  },
  {
    id: "p4", name: "Camel Overcoat", subtitle: "Outerwear · Essentials",
    category: "Outerwear", price: 1960,
    sizes: ["S","M","L","XL"], colors: ["Camel","Stone"],
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Pure camel hair, unlined for a relaxed drape. Notched lapels, two welt pockets, horn buttons. A piece built to last decades.",
    material: "100% Camel Hair", origin: "Made in Scotland", rating: 4.7, reviews: 61,
  },
  {
    id: "p5", name: "Smoke Trench Coat", subtitle: "Outerwear · Signature",
    category: "Outerwear", price: 1750, tag: "New",
    sizes: ["XS","S","M","L","XL","XXL"], colors: ["Smoke","Ivory"],
    images: [
      "https://images.unsplash.com/photo-1618244965061-1d27b208d6e8?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1619603364904-c0498317e145?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Oversized trench in smoke-grey cotton gabardine. Self-tie belt, storm flap, gunflap detail. Fully lined. Removable wool liner.",
    material: "100% Cotton Gabardine", origin: "Made in Italy", rating: 4.6, reviews: 29,
  },
  {
    id: "p6", name: "Grey Cashmere Blazer", subtitle: "Tailoring · Essentials",
    category: "Tops", price: 890,
    sizes: ["XS","S","M","L","XL"], colors: ["Grey","Charcoal","Ivory"],
    images: [
      "https://images.unsplash.com/photo-1614699406137-108f56ce3635?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1683642765591-2370edc15193?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Single-button cashmere blazer. Minimal construction with a relaxed silhouette. Peak lapels, patch pockets. Wears beautifully with anything.",
    material: "100% Grade A Cashmere", origin: "Made in Italy", rating: 4.8, reviews: 77,
  },
  {
    id: "p7", name: "Crimson Archive Dress", subtitle: "Eveningwear · Resort",
    category: "Eveningwear", price: 1540, originalPrice: 1750, tag: "Sale",
    sizes: ["XS","S","M","L"], colors: ["Crimson","Bordeaux"],
    images: [
      "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1732706431123-1aac2b46ace6?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Bias-cut silk satin in deep crimson. Adjustable spaghetti straps, cowl neckline, seam detailing at waist. A dress worn to be remembered.",
    material: "100% Silk Satin", origin: "Made in France", rating: 4.9, reviews: 18,
  },
  {
    id: "p8", name: "Velvet Noir Blazer", subtitle: "Eveningwear · AW 2025",
    category: "Tops", price: 760, tag: "New",
    sizes: ["XS","S","M","L","XL"], colors: ["Noir","Midnight Blue"],
    images: [
      "https://images.unsplash.com/photo-1732706432460-f8c52a9ae549?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1761574028219-8968571991df?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Crushed velvet single-breasted blazer with satin lapels. Semi-fitted silhouette. Two patch pockets. Fully silk-lined. The ideal evening statement.",
    material: "Cotton Velvet, Silk Lining", origin: "Made in Italy", rating: 4.7, reviews: 41,
  },
  {
    id: "p9", name: "White Silence Dress", subtitle: "Resort · SS 2025",
    category: "Eveningwear", price: 890,
    sizes: ["XS","S","M","L","XL"], colors: ["White","Ivory"],
    images: [
      "https://images.unsplash.com/flagged/photo-1570733117311-d990c3816c47?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1535735798140-0659d97a5b6d?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Two women, one moment. Layered silk-cotton voile in white. Asymmetric neckline, raw-edge hem. Resort wear elevated to ceremony.",
    material: "Silk-Cotton Voile", origin: "Made in Portugal", rating: 4.5, reviews: 16,
  },
  {
    id: "p10", name: "Leather Moto Jacket", subtitle: "Outerwear · Signature",
    category: "Outerwear", price: 3200, tag: "Limited",
    sizes: ["XS","S","M","L","XL"], colors: ["Noir","Cognac"],
    images: [
      "https://images.unsplash.com/photo-1552393700-42696fb89bfa?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Full-grain lambskin moto jacket. Asymmetric zip, quilted shoulder insets, metal hardware in aged brass. A jacket for decades of use.",
    material: "Full-Grain Lambskin Leather", origin: "Made in Spain", rating: 4.9, reviews: 55,
  },
  {
    id: "p11", name: "Scarf Neck Blouse", subtitle: "Tops · Resort",
    category: "Tops", price: 420,
    sizes: ["XS","S","M","L","XL"], colors: ["Ivory","Blush","Noir"],
    images: [
      "https://images.unsplash.com/photo-1775829102453-bb16cc85c353?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606132653399-36248f2e2a99?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Draped silk blouse with a built-in scarf detail at the neck. Relaxed through the body. Lightweight and precise.",
    material: "100% Silk Crepe de Chine", origin: "Made in Italy", rating: 4.6, reviews: 33,
  },
  {
    id: "p12", name: "Veil Midi Dress", subtitle: "Eveningwear · Exclusive",
    category: "Eveningwear", price: 1280, tag: "Exclusive",
    sizes: ["XS","S","M","L"], colors: ["Ivory","Blush"],
    images: [
      "https://images.unsplash.com/photo-1775829102453-bb16cc85c353?w=900&h=1200&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1721190164320-57c44eac1d0f?w=900&h=1200&fit=crop&auto=format",
    ],
    description: "Semi-sheer silk organza midi dress with a slip lining. Self-covered buttons at the back. A piece of quiet ceremony.",
    material: "Silk Organza + Silk Slip Lining", origin: "Made in France", rating: 4.8, reviews: 27,
  },
];

const CATEGORIES = ["All", "Eveningwear", "Outerwear", "Tops"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_RANGES = [
  { label: "Under €500", min: 0, max: 500 },
  { label: "€500 – €1,000", min: 500, max: 1000 },
  { label: "€1,000 – €2,000", min: 1000, max: 2000 },
  { label: "Over €2,000", min: 2000, max: 99999 },
];
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Top Rated"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => `€ ${n.toLocaleString()}`;
const cartTotal = (cart: CartItem[]) => cart.reduce((s, i) => s + i.product.price * i.qty, 0);
const cartCount = (cart: CartItem[]) => cart.reduce((s, i) => s + i.qty, 0);

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({
  view, setView, cart, wishlist, openBag, scrolled,
}: {
  view: View; setView: (v: View) => void; cart: CartItem[];
  wishlist: Set<string>; openBag: () => void; scrolled: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || view !== "home" ? "bg-[#0a0905]/97 backdrop-blur-md border-b border-[rgba(240,235,226,0.08)]" : "bg-transparent"}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 h-14 md:h-16 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-6 md:gap-8 flex-1">
            <button className="md:hidden text-[#f0ebe2]/60 hover:text-[#f0ebe2]" onClick={() => setMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex gap-7">
              {["Shop", "Eveningwear", "Outerwear"].map((l) => (
                <button key={l} onClick={() => { setView("shop"); }}
                  className="font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase text-[#f0ebe2]/40 hover:text-[#f0ebe2] transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
          {/* Logo */}
          <button onClick={() => setView("home")} className="absolute left-1/2 -translate-x-1/2">
            <span className="font-['Playfair_Display'] text-xl md:text-2xl font-bold tracking-[0.15em] text-[#f0ebe2]">VAULTE</span>
          </button>
          {/* Right */}
          <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end">
            <button onClick={() => setSearchOpen(true)} className="text-[#f0ebe2]/50 hover:text-[#f0ebe2] transition-colors hidden md:block">
              <Search size={16} />
            </button>
            <button onClick={() => setView("wishlist")} className="relative text-[#f0ebe2]/50 hover:text-[#f0ebe2] transition-colors">
              <Heart size={16} className={wishlist.size > 0 ? "fill-[#c9a97a] text-[#c9a97a]" : ""} />
              {wishlist.size > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#c9a97a] text-[#0a0905] font-['DM_Mono'] text-[8px] flex items-center justify-center">{wishlist.size}</span>
              )}
            </button>
            <button onClick={openBag} className="relative text-[#f0ebe2]/50 hover:text-[#f0ebe2] transition-colors">
              <ShoppingBag size={16} />
              {cartCount(cart) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#c9a97a] text-[#0a0905] font-['DM_Mono'] text-[8px] flex items-center justify-center">{cartCount(cart)}</span>
              )}
            </button>
          </div>
        </div>
        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="border-t border-[rgba(240,235,226,0.08)] overflow-hidden bg-[#0a0905]">
              <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-3 flex items-center gap-4">
                <Search size={14} className="text-[#8a8272]" />
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search collections, pieces, designers…"
                  onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") { setSearchOpen(false); setQuery(""); } }}
                  className="flex-1 bg-transparent font-['DM_Mono'] text-sm text-[#f0ebe2] placeholder:text-[#8a8272]/50 outline-none" />
                <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[#8a8272] hover:text-[#f0ebe2]"><X size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.35 }}
            className="fixed inset-0 z-[100] bg-[#0a0905] flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-[rgba(240,235,226,0.08)]">
              <span className="font-['Playfair_Display'] text-xl font-bold tracking-widest text-[#f0ebe2]">VAULTE</span>
              <button onClick={() => setMenuOpen(false)} className="text-[#f0ebe2]/60"><X size={20} /></button>
            </div>
            <div className="flex flex-col p-8 gap-5 flex-1 overflow-y-auto">
              {[{ label: "Home", v: "home" }, { label: "Shop All", v: "shop" }, { label: "Eveningwear", v: "shop" }, { label: "Outerwear", v: "shop" }, { label: "Wishlist", v: "wishlist" }].map(({ label, v }) => (
                <button key={label} onClick={() => { setView(v as View); setMenuOpen(false); }}
                  className="font-['Playfair_Display'] text-2xl font-light text-[#f0ebe2]/60 hover:text-[#f0ebe2] text-left transition-colors">
                  {label}
                </button>
              ))}
            </div>
            <div className="px-8 pb-10 flex gap-6">
              <span className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase">Paris · London · Tokyo</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── BAG DRAWER ──────────────────────────────────────────────────────────────
function BagDrawer({ open, onClose, cart, updateQty, removeItem, onCheckout }: {
  open: boolean; onClose: () => void; cart: CartItem[];
  updateQty: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
  onCheckout: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[420px] bg-[#111009] border-l border-[rgba(240,235,226,0.08)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(240,235,226,0.08)]">
              <div>
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#f0ebe2]">Your Bag</h2>
                <p className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase mt-0.5">{cartCount(cart)} {cartCount(cart) === 1 ? "piece" : "pieces"}</p>
              </div>
              <button onClick={onClose} className="text-[#f0ebe2]/40 hover:text-[#f0ebe2] transition-colors"><X size={20} /></button>
            </div>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <ShoppingBag size={32} className="text-[#8a8272]/30" />
                  <p className="font-['Playfair_Display'] text-xl text-[#f0ebe2]/40 italic">Your bag is empty.</p>
                  <button onClick={onClose} className="font-['DM_Mono'] text-[11px] tracking-widest uppercase text-[#c9a97a] hover:text-[#f0ebe2] transition-colors">
                    Continue Shopping →
                  </button>
                </div>
              ) : cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 pb-5 border-b border-[rgba(240,235,226,0.06)] last:border-0">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-[#1e1c16]">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-['Playfair_Display'] text-sm text-[#f0ebe2] leading-tight">{item.product.name}</p>
                        <p className="font-['DM_Mono'] text-[10px] text-[#8a8272] mt-0.5">Size {item.size} · {item.color}</p>
                      </div>
                      <button onClick={() => removeItem(item.product.id, item.size)} className="text-[#8a8272]/50 hover:text-[#f0ebe2] transition-colors flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-[rgba(240,235,226,0.1)]">
                        <button onClick={() => updateQty(item.product.id, item.size, -1)} className="w-7 h-7 flex items-center justify-center text-[#8a8272] hover:text-[#f0ebe2] transition-colors">
                          <Minus size={11} />
                        </button>
                        <span className="font-['DM_Mono'] text-xs text-[#f0ebe2] w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.size, 1)} className="w-7 h-7 flex items-center justify-center text-[#8a8272] hover:text-[#f0ebe2] transition-colors">
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{fmt(item.product.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[rgba(240,235,226,0.08)] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-['DM_Mono'] text-[11px] tracking-widest text-[#8a8272] uppercase">Subtotal</span>
                  <span className="font-['Playfair_Display'] text-xl text-[#f0ebe2]">{fmt(cartTotal(cart))}</span>
                </div>
                <p className="font-['DM_Mono'] text-[10px] text-[#8a8272]/60">Shipping calculated at checkout. Complimentary on orders over €300.</p>
                <button onClick={onCheckout}
                  className="w-full bg-[#f0ebe2] text-[#0a0905] py-4 font-['DM_Mono'] text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a97a] transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={13} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, wishlist, toggleWishlist, onClick }: {
  product: Product; wishlist: Set<string>; toggleWishlist: (id: string) => void; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const wished = wishlist.has(product.id);
  return (
    <div className="group cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative overflow-hidden bg-[#1e1c16] aspect-[3/4]" onClick={onClick}>
        <img src={hovered && product.images[1] ? product.images[1] : product.images[0]} alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]" />
        {product.tag && (
          <span className="absolute top-3 left-3 font-['DM_Mono'] text-[8px] tracking-[0.2em] px-2 py-0.5 bg-[#c9a97a] text-[#0a0905] uppercase">
            {product.tag}
          </span>
        )}
        <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#0a0905]/70 backdrop-blur-sm hover:bg-[#0a0905] transition-colors">
          <Heart size={13} className={wished ? "fill-[#c9a97a] text-[#c9a97a]" : "text-[#f0ebe2]/60"} />
        </button>
        <motion.div initial={{ y: "100%" }} animate={{ y: hovered ? 0 : "100%" }} transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-[#0a0905]/90 backdrop-blur-sm px-4 py-3">
          <button onClick={onClick} className="w-full font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase text-[#f0ebe2] hover:text-[#c9a97a] transition-colors">
            Quick View →
          </button>
        </motion.div>
      </div>
      <div className="pt-3 pb-1">
        <p className="font-['DM_Mono'] text-[9px] tracking-[0.2em] text-[#8a8272] uppercase mb-1">{product.subtitle}</p>
        <div className="flex items-end justify-between gap-2">
          <h3 className="font-['Playfair_Display'] text-base text-[#f0ebe2] leading-tight">{product.name}</h3>
          <div className="text-right flex-shrink-0">
            <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="font-['DM_Mono'] text-[10px] text-[#8a8272] line-through ml-2">{fmt(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HomePage({ setView, setSelectedProduct, wishlist, toggleWishlist, addToCart }: {
  setView: (v: View) => void; setSelectedProduct: (id: string) => void;
  wishlist: Set<string>; toggleWishlist: (id: string) => void;
  addToCart: (p: Product, size: string, color: string) => void;
}) {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=1800&h=1100&fit=crop&auto=format"
            alt="VAULTE AW2025 campaign" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0905] via-[#0a0905]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0905]/70 via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 right-6 md:right-14 flex flex-col items-end gap-1.5">
          <span className="font-['DM_Mono'] text-[9px] tracking-[0.3em] text-[#f0ebe2]/25 uppercase">Autumn / Winter</span>
          <span className="font-['DM_Mono'] text-[9px] tracking-[0.3em] text-[#f0ebe2]/25 uppercase">2025 Collection</span>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-12 pb-16 md:pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}>
            <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] text-[#c9a97a]/80 uppercase mb-5">— The New Vocabulary</p>
            <h1 className="font-['Playfair_Display'] text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] text-[#f0ebe2] mb-2">Dressed</h1>
            <h1 className="font-['Playfair_Display'] text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] text-[#f0ebe2] italic mb-2">in</h1>
            <h1 className="font-['Playfair_Display'] text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] text-[#c9a97a] mb-8">Shadow.</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap gap-4">
            <button onClick={() => setView("shop")}
              className="group flex items-center gap-3 bg-[#f0ebe2] text-[#0a0905] px-7 py-3.5 font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase hover:bg-[#c9a97a] transition-colors">
              Shop Collection <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase text-[#f0ebe2]/40 hover:text-[#f0ebe2] transition-colors">
              <span className="w-7 h-px bg-current" /> Watch Film
            </button>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-[rgba(240,235,226,0.08)] py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite]">
          {Array(12).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-6 mr-6">
              <span className="font-['DM_Mono'] text-[10px] tracking-[0.22em] text-[#f0ebe2]/25 uppercase">New Collection</span>
              <span className="text-[#c9a97a] text-[10px]">◆</span>
              <span className="font-['DM_Mono'] text-[10px] tracking-[0.22em] text-[#f0ebe2]/25 uppercase">VAULTE · SS 2025</span>
              <span className="text-[#c9a97a] text-[10px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] text-[#c9a97a]/60 uppercase mb-2">— Featured</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2]">New Arrivals</h2>
          </div>
          <button onClick={() => setView("shop")} className="hidden md:flex items-center gap-2 font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#8a8272] hover:text-[#f0ebe2] transition-colors group">
            View All <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWishlist={toggleWishlist}
              onClick={() => { setSelectedProduct(p.id); setView("product"); }} />
          ))}
        </div>
        <div className="mt-8 md:hidden flex justify-center">
          <button onClick={() => setView("shop")} className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#c9a97a] border border-[rgba(240,235,226,0.15)] px-6 py-3">
            Shop All
          </button>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="border-t border-[rgba(240,235,226,0.08)] grid md:grid-cols-2">
        <div className="relative h-[60vw] md:h-[50vw] max-h-[600px] overflow-hidden bg-[#1e1c16]">
          <img src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=900&h=700&fit=crop&auto=format"
            alt="Outerwear collection" className="w-full h-full object-cover opacity-80 hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0905]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#c9a97a] uppercase mb-2">Collection</p>
            <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2] mb-4">Outerwear</h3>
            <button onClick={() => setView("shop")} className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#f0ebe2]/60 hover:text-[#f0ebe2] transition-colors flex items-center gap-2">
              Shop Now <ArrowRight size={11} />
            </button>
          </div>
        </div>
        <div className="relative h-[60vw] md:h-[50vw] max-h-[600px] overflow-hidden bg-[#111009]">
          <img src="https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=900&h=700&fit=crop&auto=format"
            alt="Eveningwear collection" className="w-full h-full object-cover opacity-80 hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0905]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#c9a97a] uppercase mb-2">Collection</p>
            <h3 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2] mb-4">Eveningwear</h3>
            <button onClick={() => setView("shop")} className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#f0ebe2]/60 hover:text-[#f0ebe2] transition-colors flex items-center gap-2">
              Shop Now <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-[rgba(240,235,226,0.08)] grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(240,235,226,0.08)]">
        {[{ v: "2019", l: "Founded" }, { v: "47", l: "Countries" }, { v: "12", l: "Flagship Stores" }, { v: "38k", l: "Archive Pieces" }].map(s => (
          <div key={s.l} className="px-6 py-8 text-center">
            <div className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2] mb-1">{s.v}</div>
            <div className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#8a8272] uppercase">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] text-[#c9a97a]/60 uppercase mb-3">— Access</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2] mb-2">Enter the<br /><span className="italic font-normal text-[#f0ebe2]/35">inner circle.</span></h2>
            <p className="font-['DM_Sans'] text-sm text-[#8a8272] font-light max-w-xs">Early access to collections. Private event invitations. Pieces that exist nowhere else.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(240,235,226,0.08)] pt-12 pb-8">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="font-['Playfair_Display'] text-2xl font-bold tracking-widest mb-3 text-[#f0ebe2]">VAULTE</div>
              <p className="font-['DM_Sans'] text-xs text-[#8a8272]/60 font-light leading-relaxed max-w-[180px]">Luxury fashion for those who wear their silence like armour.</p>
              <div className="flex gap-4 mt-5">
                <Instagram size={14} className="text-[#8a8272]/40 hover:text-[#f0ebe2] cursor-pointer transition-colors" />
                <Twitter size={14} className="text-[#8a8272]/40 hover:text-[#f0ebe2] cursor-pointer transition-colors" />
              </div>
            </div>
            {[{ h: "Collections", ls: ["Eveningwear", "Outerwear", "Tops", "Archive", "Sale"] },
              { h: "Company", ls: ["About VAULTE", "Sustainability", "Press", "Careers"] },
              { h: "Support", ls: ["Size Guide", "Shipping & Returns", "Contact Us", "Stockists"] }
            ].map(col => (
              <div key={col.h}>
                <p className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#f0ebe2]/25 uppercase mb-4">{col.h}</p>
                <ul className="space-y-2.5">
                  {col.ls.map(l => (
                    <li key={l}><a href="#" className="font-['DM_Sans'] text-xs text-[#8a8272]/50 hover:text-[#f0ebe2] transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(240,235,226,0.06)] pt-6 flex flex-col md:flex-row justify-between gap-3">
            <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#f0ebe2]/15 uppercase">© 2025 VAULTE S.A.S.</p>
            <div className="flex gap-5">
              {["Privacy", "Terms", "Cookies"].map(t => (
                <a key={t} href="#" className="font-['DM_Mono'] text-[9px] tracking-widest text-[#f0ebe2]/15 hover:text-[#f0ebe2]/40 uppercase transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return done ? (
    <div className="py-6"><p className="font-['Playfair_Display'] text-xl text-[#f0ebe2] italic">Welcome to VAULTE.</p></div>
  ) : (
    <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }} className="space-y-2">
      <div className="border border-[rgba(240,235,226,0.12)] flex">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 bg-transparent px-4 py-3.5 font-['DM_Mono'] text-sm text-[#f0ebe2] placeholder:text-[#8a8272]/40 outline-none" />
        <button type="submit" className="bg-[#f0ebe2] text-[#0a0905] px-5 font-['DM_Mono'] text-[10px] tracking-widest uppercase hover:bg-[#c9a97a] transition-colors">Join</button>
      </div>
      <p className="font-['DM_Mono'] text-[9px] text-[#8a8272]/30">Unsubscribe anytime. No spam, ever.</p>
    </form>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────────────────
function ShopPage({ setView, setSelectedProduct, wishlist, toggleWishlist }: {
  setView: (v: View) => void; setSelectedProduct: (id: string) => void;
  wishlist: Set<string>; toggleWishlist: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("Newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSize = (s: string) =>
    setActiveSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const filtered = PRODUCTS.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (activeSizes.length > 0 && !activeSizes.some(s => p.sizes.includes(s))) return false;
    if (activePriceRange !== null) {
      const r = PRICE_RANGES[activePriceRange];
      if (p.price < r.min || p.price > r.max) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  const hasFilters = activeCategory !== "All" || activeSizes.length > 0 || activePriceRange !== null;

  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <p className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#8a8272] uppercase mb-3">Category</p>
        <div className="space-y-1.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`block font-['DM_Sans'] text-sm transition-colors w-full text-left ${activeCategory === c ? "text-[#f0ebe2]" : "text-[#8a8272] hover:text-[#f0ebe2]"}`}>
              {c}
              {activeCategory === c && <span className="ml-2 text-[#c9a97a]">◆</span>}
            </button>
          ))}
        </div>
      </div>
      {/* Size */}
      <div>
        <p className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#8a8272] uppercase mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleSize(s)}
              className={`w-9 h-9 font-['DM_Mono'] text-[10px] transition-all ${activeSizes.includes(s) ? "bg-[#f0ebe2] text-[#0a0905]" : "border border-[rgba(240,235,226,0.1)] text-[#8a8272] hover:border-[rgba(240,235,226,0.3)]"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* Price */}
      <div>
        <p className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#8a8272] uppercase mb-3">Price</p>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((r, i) => (
            <button key={r.label} onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
              className={`flex items-center gap-2 font-['DM_Sans'] text-sm transition-colors w-full text-left ${activePriceRange === i ? "text-[#f0ebe2]" : "text-[#8a8272] hover:text-[#f0ebe2]"}`}>
              <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 ${activePriceRange === i ? "border-[#f0ebe2] bg-[#f0ebe2]" : "border-[rgba(240,235,226,0.2)]"}`}>
                {activePriceRange === i && <Check size={9} className="text-[#0a0905]" />}
              </span>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {hasFilters && (
        <button onClick={() => { setActiveCategory("All"); setActiveSizes([]); setActivePriceRange(null); }}
          className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#c9a97a] hover:text-[#f0ebe2] transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Top bar */}
      <div className="border-b border-[rgba(240,235,226,0.08)] sticky top-14 md:top-16 z-30 bg-[#0a0905]/97 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`flex-shrink-0 font-['DM_Mono'] text-[10px] tracking-[0.15em] px-3.5 py-1.5 uppercase transition-all ${activeCategory === c ? "bg-[#f0ebe2] text-[#0a0905]" : "border border-[rgba(240,235,226,0.1)] text-[#8a8272] hover:text-[#f0ebe2]"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-['DM_Mono'] text-[10px] text-[#8a8272] hidden md:block">{filtered.length} pieces</span>
            <div className="relative hidden md:block">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="font-['DM_Mono'] text-[10px] tracking-[0.15em] uppercase bg-transparent text-[#8a8272] hover:text-[#f0ebe2] outline-none cursor-pointer pr-5 appearance-none">
                {SORT_OPTIONS.map(o => <option key={o} value={o} className="bg-[#111009] text-[#f0ebe2]">{o}</option>)}
              </select>
              <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8a8272] pointer-events-none" />
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#8a8272] hover:text-[#f0ebe2] transition-colors md:hidden">
              <SlidersHorizontal size={13} /> Filter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-12 py-8 md:py-12">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-48 flex-shrink-0 sticky top-32 self-start">
            <FilterPanel />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-['Playfair_Display'] text-2xl text-[#f0ebe2]/30 italic mb-3">No pieces found.</p>
                <button onClick={() => { setActiveCategory("All"); setActiveSizes([]); setActivePriceRange(null); }}
                  className="font-['DM_Mono'] text-[11px] tracking-widest uppercase text-[#c9a97a]">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWishlist={toggleWishlist}
                    onClick={() => { setSelectedProduct(p.id); setView("product"); }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed bottom-0 left-0 right-0 z-60 bg-[#111009] border-t border-[rgba(240,235,226,0.1)] p-6 pb-safe max-h-[80vh] overflow-y-auto rounded-t-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#f0ebe2]">Filter</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-[#8a8272]"><X size={18} /></button>
              </div>
              <FilterPanel />
              <button onClick={() => setSidebarOpen(false)}
                className="w-full mt-6 bg-[#f0ebe2] text-[#0a0905] py-4 font-['DM_Mono'] text-[11px] tracking-widest uppercase">
                Show {filtered.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ productId, setView, wishlist, toggleWishlist, addToCart }: {
  productId: string; setView: (v: View) => void; wishlist: Set<string>;
  toggleWishlist: (id: string) => void; addToCart: (p: Product, size: string, color: string) => void;
}) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [sizeErr, setSizeErr] = useState(false);
  const [added, setAdded] = useState(false);
  const wished = wishlist.has(product.id);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  useEffect(() => { setSelectedSize(""); setSelectedColor(product.colors[0]); setActiveImg(0); setAdded(false); }, [productId]);

  const handleAdd = () => {
    if (!selectedSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return; }
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="pt-14 md:pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-12 py-4 border-b border-[rgba(240,235,226,0.06)]">
        <div className="flex items-center gap-2 font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase">
          <button onClick={() => setView("home")} className="hover:text-[#f0ebe2] transition-colors">Home</button>
          <ChevronRight size={10} />
          <button onClick={() => setView("shop")} className="hover:text-[#f0ebe2] transition-colors">Shop</button>
          <ChevronRight size={10} />
          <span className="text-[#f0ebe2]/50 truncate max-w-[120px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-12 py-8 md:py-12">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-14">
          {/* Images */}
          <div className="flex gap-3 md:gap-4">
            <div className="hidden md:flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-20 overflow-hidden flex-shrink-0 transition-all ${activeImg === i ? "ring-1 ring-[#f0ebe2]" : "opacity-40 hover:opacity-70"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-[#1e1c16]">
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={product.images[activeImg]} alt={product.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover" />
              </AnimatePresence>
              <button onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-[#0a0905]/80 backdrop-blur-sm hover:bg-[#0a0905] transition-colors">
                <Heart size={14} className={wished ? "fill-[#c9a97a] text-[#c9a97a]" : "text-[#f0ebe2]/70"} />
              </button>
              {/* Mobile dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? "bg-[#f0ebe2] scale-125" : "bg-[#f0ebe2]/30"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className={i <= Math.round(product.rating) ? "fill-[#c9a97a] text-[#c9a97a]" : "text-[#3a3830]"} />
              ))}
              <span className="font-['DM_Mono'] text-[10px] text-[#8a8272] ml-1">({product.reviews})</span>
            </div>
            <p className="font-['DM_Mono'] text-[9px] tracking-[0.25em] text-[#c9a97a]/70 uppercase mb-1">{product.category}</p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2] leading-tight mb-1">{product.name}</h1>
            <p className="font-['DM_Sans'] text-sm text-[#8a8272] mb-5">{product.subtitle}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-['DM_Mono'] text-2xl text-[#f0ebe2]">{fmt(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="font-['DM_Mono'] text-sm text-[#8a8272] line-through">{fmt(product.originalPrice)}</span>
                  <span className="font-['DM_Mono'] text-[9px] tracking-widest px-2 py-0.5 bg-[#c9a97a] text-[#0a0905] uppercase">
                    −{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="font-['DM_Sans'] text-sm text-[#8a8272] leading-relaxed font-light mb-6 max-w-sm">{product.description}</p>

            {/* Color */}
            <div className="mb-5">
              <p className="font-['DM_Mono'] text-[9px] tracking-[0.2em] text-[#8a8272] uppercase mb-2">
                Colour — <span className="text-[#f0ebe2]">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`font-['DM_Mono'] text-[10px] px-3 py-1.5 transition-all ${selectedColor === c ? "bg-[#f0ebe2] text-[#0a0905]" : "border border-[rgba(240,235,226,0.1)] text-[#8a8272] hover:border-[rgba(240,235,226,0.3)]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className={`font-['DM_Mono'] text-[9px] tracking-[0.2em] uppercase ${sizeErr ? "text-red-400" : "text-[#8a8272]"}`}>
                  {sizeErr ? "Please select a size" : "Size"}
                  {selectedSize && <span className="text-[#f0ebe2] ml-1">— {selectedSize}</span>}
                </p>
                <button className="font-['DM_Mono'] text-[9px] tracking-widest uppercase text-[#c9a97a] hover:text-[#f0ebe2] transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-11 h-11 font-['DM_Mono'] text-xs transition-all ${selectedSize === s ? "bg-[#f0ebe2] text-[#0a0905]" : sizeErr ? "border border-red-400/40 text-[#8a8272]" : "border border-[rgba(240,235,226,0.1)] text-[#8a8272] hover:border-[rgba(240,235,226,0.35)] hover:text-[#f0ebe2]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-2 mb-6">
              <motion.button onClick={handleAdd}
                className={`flex-1 py-4 font-['DM_Mono'] text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors ${added ? "bg-[#c9a97a] text-[#0a0905]" : "bg-[#f0ebe2] text-[#0a0905] hover:bg-[#c9a97a]"}`}
                whileTap={{ scale: 0.98 }}>
                {added ? <><Check size={13} /> Added to Bag</> : <><ShoppingBag size={13} /> Add to Bag</>}
              </motion.button>
              <button onClick={() => toggleWishlist(product.id)}
                className="w-13 h-auto px-4 border border-[rgba(240,235,226,0.1)] hover:border-[rgba(240,235,226,0.3)] text-[#8a8272] hover:text-[#c9a97a] transition-colors flex items-center justify-center">
                <Heart size={14} className={wished ? "fill-[#c9a97a] text-[#c9a97a]" : ""} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 border-t border-[rgba(240,235,226,0.08)] pt-5">
              {[
                { label: "Material", value: product.material },
                { label: "Origin", value: product.origin },
                { label: "Reference", value: `VLT-2025-${product.id.toUpperCase()}` },
              ].map(d => (
                <div key={d.label} className="flex gap-4">
                  <span className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase w-20 flex-shrink-0">{d.label}</span>
                  <span className="font-['DM_Sans'] text-xs text-[#f0ebe2]/50">{d.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-[rgba(240,235,226,0.08)] space-y-2.5">
              {[
                { icon: Truck, text: "Complimentary delivery on orders over €300" },
                { icon: Package, text: "Free returns within 30 days" },
                { icon: Lock, text: "Secure, encrypted checkout" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={13} className="text-[#c9a97a] flex-shrink-0" />
                  <span className="font-['DM_Mono'] text-[10px] text-[#8a8272]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[rgba(240,235,226,0.08)]">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#f0ebe2] mb-8">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map(p => (
                <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWishlist={toggleWishlist}
                  onClick={() => { setView("product"); window.scrollTo(0, 0); setTimeout(() => window.scrollTo(0, 0), 10); }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────────────────────
function WishlistPage({ setView, setSelectedProduct, wishlist, toggleWishlist, addToCart }: {
  setView: (v: View) => void; setSelectedProduct: (id: string) => void;
  wishlist: Set<string>; toggleWishlist: (id: string) => void;
  addToCart: (p: Product, size: string, color: string) => void;
}) {
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  return (
    <div className="pt-14 md:pt-16 min-h-screen max-w-[1440px] mx-auto px-5 md:px-12 py-10 md:py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-['DM_Mono'] text-[10px] tracking-[0.3em] text-[#c9a97a]/60 uppercase mb-2">— Saved</p>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#f0ebe2]">Wishlist</h1>
        </div>
        {items.length > 0 && (
          <span className="font-['DM_Mono'] text-[10px] text-[#8a8272]">{items.length} {items.length === 1 ? "piece" : "pieces"}</span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <Heart size={36} className="text-[#8a8272]/20 mx-auto mb-5" />
          <p className="font-['Playfair_Display'] text-2xl text-[#f0ebe2]/30 italic mb-2">Nothing saved yet.</p>
          <p className="font-['DM_Sans'] text-sm text-[#8a8272]/40 mb-8">Pieces you heart will appear here.</p>
          <button onClick={() => setView("shop")} className="font-['DM_Mono'] text-[11px] tracking-widest uppercase text-[#c9a97a] border border-[rgba(201,169,122,0.3)] px-8 py-3 hover:bg-[#c9a97a] hover:text-[#0a0905] transition-colors">
            Browse Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map(p => (
            <ProductCard key={p.id} product={p} wishlist={wishlist} toggleWishlist={toggleWishlist}
              onClick={() => { setSelectedProduct(p.id); setView("product"); }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
interface ShippingForm { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; postcode: string; country: string; }
interface PaymentForm { cardNumber: string; name: string; expiry: string; cvv: string; }

function CheckoutPage({ cart, onComplete, setView }: {
  cart: CartItem[]; onComplete: () => void; setView: (v: View) => void;
}) {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [shipping, setShipping] = useState<ShippingForm>({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postcode: "", country: "France" });
  const [payment, setPayment] = useState<PaymentForm>({ cardNumber: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<"card" | "paypal">("card");

  const shippingFee = cartTotal(cart) >= 300 ? 0 : 14;
  const total = cartTotal(cart) + shippingFee;

  const updateShipping = (k: keyof ShippingForm, v: string) => setShipping(p => ({ ...p, [k]: v }));
  const updatePayment = (k: keyof PaymentForm, v: string) => setPayment(p => ({ ...p, [k]: v }));

  const formatCard = (v: string) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    onComplete();
  };

  const steps = [
    { n: 1, label: "Shipping" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Review" },
  ];

  const inputCls = "w-full bg-[#111009] border border-[rgba(240,235,226,0.1)] px-4 py-3 font-['DM_Mono'] text-sm text-[#f0ebe2] placeholder:text-[#8a8272]/40 outline-none focus:border-[rgba(240,235,226,0.35)] transition-colors";

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-[#0a0905]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => step === 1 ? setView("home") : setStep(s => (s - 1) as CheckoutStep)}
            className="flex items-center gap-2 font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#8a8272] hover:text-[#f0ebe2] transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
          <span className="font-['Playfair_Display'] text-xl font-bold tracking-widest text-[#f0ebe2]">VAULTE</span>
          <div className="w-16" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10 md:mb-14">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 flex items-center justify-center font-['DM_Mono'] text-xs transition-all duration-300 ${step >= s.n ? "bg-[#f0ebe2] text-[#0a0905]" : "border border-[rgba(240,235,226,0.15)] text-[#8a8272]"}`}>
                  {step > s.n ? <Check size={13} /> : s.n}
                </div>
                <span className={`font-['DM_Mono'] text-[9px] tracking-widest uppercase ${step >= s.n ? "text-[#f0ebe2]/60" : "text-[#8a8272]/40"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-16 md:w-24 h-px mx-3 mb-4 transition-all ${step > s.n ? "bg-[#f0ebe2]/30" : "bg-[rgba(240,235,226,0.08)]"}`} />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 md:gap-12 items-start">
          {/* Left: Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#f0ebe2] mb-6">Shipping Details</h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="First name" value={shipping.firstName} onChange={e => updateShipping("firstName", e.target.value)} className={inputCls} />
                      <input placeholder="Last name" value={shipping.lastName} onChange={e => updateShipping("lastName", e.target.value)} className={inputCls} />
                    </div>
                    <input type="email" placeholder="Email address" value={shipping.email} onChange={e => updateShipping("email", e.target.value)} className={inputCls} />
                    <input type="tel" placeholder="Phone number" value={shipping.phone} onChange={e => updateShipping("phone", e.target.value)} className={inputCls} />
                    <input placeholder="Street address" value={shipping.address} onChange={e => updateShipping("address", e.target.value)} className={inputCls} />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="City" value={shipping.city} onChange={e => updateShipping("city", e.target.value)} className={inputCls} />
                      <input placeholder="Postcode" value={shipping.postcode} onChange={e => updateShipping("postcode", e.target.value)} className={inputCls} />
                    </div>
                    <select value={shipping.country} onChange={e => updateShipping("country", e.target.value)}
                      className={inputCls + " cursor-pointer"}>
                      {["France", "United Kingdom", "Germany", "Italy", "United States", "Japan", "Australia"].map(c => (
                        <option key={c} value={c} className="bg-[#111009]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-6 space-y-2">
                    <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#8a8272] uppercase mb-3">Shipping Method</p>
                    {[{ label: "Standard Delivery", sub: "5–7 business days", price: shippingFee === 0 ? "Free" : "€ 14" }, { label: "Express Delivery", sub: "2–3 business days", price: "€ 28" }].map((opt, i) => (
                      <label key={opt.label} className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${i === 0 ? "border-[rgba(240,235,226,0.3)] bg-[rgba(240,235,226,0.03)]" : "border-[rgba(240,235,226,0.08)]"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${i === 0 ? "border-[#f0ebe2]" : "border-[rgba(240,235,226,0.2)]"}`}>
                            {i === 0 && <div className="w-2 h-2 rounded-full bg-[#f0ebe2]" />}
                          </div>
                          <div>
                            <p className="font-['DM_Mono'] text-xs text-[#f0ebe2]">{opt.label}</p>
                            <p className="font-['DM_Mono'] text-[10px] text-[#8a8272]">{opt.sub}</p>
                          </div>
                        </div>
                        <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)}
                    className="mt-8 w-full bg-[#f0ebe2] text-[#0a0905] py-4 font-['DM_Mono'] text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a97a] transition-colors flex items-center justify-center gap-2">
                    Continue to Payment <ArrowRight size={13} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#f0ebe2] mb-6">Payment</h2>
                  {/* Method toggle */}
                  <div className="flex gap-2 mb-6">
                    {(["card", "paypal"] as const).map(m => (
                      <button key={m} onClick={() => setMethod(m)}
                        className={`flex-1 py-3 font-['DM_Mono'] text-[11px] tracking-widest uppercase transition-all ${method === m ? "bg-[#f0ebe2] text-[#0a0905]" : "border border-[rgba(240,235,226,0.1)] text-[#8a8272] hover:text-[#f0ebe2]"}`}>
                        {m === "card" ? "Credit / Debit" : "PayPal"}
                      </button>
                    ))}
                  </div>
                  {method === "card" ? (
                    <div className="space-y-3">
                      {/* Card visual */}
                      <div className="relative h-36 bg-gradient-to-br from-[#1e1c16] to-[#2a2820] border border-[rgba(240,235,226,0.1)] p-5 mb-2 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c9a97a]/5 -translate-y-8 translate-x-8" />
                        <p className="font-['DM_Mono'] text-[9px] tracking-[0.3em] text-[#8a8272] uppercase mb-6">Credit Card</p>
                        <p className="font-['DM_Mono'] text-base text-[#f0ebe2] tracking-[0.2em] mb-4">
                          {payment.cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-['DM_Mono'] text-[8px] text-[#8a8272] uppercase">Name</p>
                            <p className="font-['DM_Mono'] text-xs text-[#f0ebe2]">{payment.name || "YOUR NAME"}</p>
                          </div>
                          <div>
                            <p className="font-['DM_Mono'] text-[8px] text-[#8a8272] uppercase">Expires</p>
                            <p className="font-['DM_Mono'] text-xs text-[#f0ebe2]">{payment.expiry || "MM/YY"}</p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-5">
                          <div className="flex">
                            <div className="w-6 h-6 rounded-full bg-[#c9a97a]/60" />
                            <div className="w-6 h-6 rounded-full bg-[#c9a97a]/30 -ml-3" />
                          </div>
                        </div>
                      </div>
                      <input placeholder="Card number" value={payment.cardNumber} onChange={e => updatePayment("cardNumber", formatCard(e.target.value))} className={inputCls} maxLength={19} />
                      <input placeholder="Cardholder name" value={payment.name} onChange={e => updatePayment("name", e.target.value)} className={inputCls} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="MM/YY" value={payment.expiry} onChange={e => updatePayment("expiry", formatExpiry(e.target.value))} className={inputCls} maxLength={5} />
                        <input placeholder="CVV" value={payment.cvv} onChange={e => updatePayment("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} className={inputCls} maxLength={4} />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[rgba(240,235,226,0.1)] p-8 text-center">
                      <p className="font-['DM_Mono'] text-[11px] tracking-widest text-[#8a8272] mb-2">You will be redirected to PayPal</p>
                      <p className="font-['DM_Mono'] text-[10px] text-[#8a8272]/40">Secure payment via PayPal's encrypted gateway</p>
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2 p-3 bg-[rgba(240,235,226,0.03)] border border-[rgba(240,235,226,0.06)]">
                    <Lock size={11} className="text-[#8a8272]" />
                    <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#8a8272]">256-bit SSL encrypted. Your data is never stored.</p>
                  </div>
                  <button onClick={() => setStep(3)}
                    className="mt-6 w-full bg-[#f0ebe2] text-[#0a0905] py-4 font-['DM_Mono'] text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a97a] transition-colors flex items-center justify-center gap-2">
                    Review Order <ArrowRight size={13} />
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#f0ebe2] mb-6">Review Order</h2>
                  {/* Shipping summary */}
                  <div className="border border-[rgba(240,235,226,0.1)] p-5 mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#c9a97a] uppercase mb-2">Ship to</p>
                        <p className="font-['DM_Sans'] text-sm text-[#f0ebe2]">{shipping.firstName} {shipping.lastName}</p>
                        <p className="font-['DM_Sans'] text-xs text-[#8a8272]">{shipping.address}, {shipping.city} {shipping.postcode}</p>
                        <p className="font-['DM_Sans'] text-xs text-[#8a8272]">{shipping.country}</p>
                        <p className="font-['DM_Mono'] text-xs text-[#8a8272] mt-1">{shipping.email}</p>
                      </div>
                      <button onClick={() => setStep(1)} className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#c9a97a] hover:text-[#f0ebe2] transition-colors">Edit</button>
                    </div>
                  </div>
                  {/* Payment summary */}
                  <div className="border border-[rgba(240,235,226,0.1)] p-5 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-['DM_Mono'] text-[9px] tracking-widest text-[#c9a97a] uppercase mb-2">Payment</p>
                        <p className="font-['DM_Mono'] text-sm text-[#f0ebe2]">
                          {method === "card" ? `•••• •••• •••• ${payment.cardNumber.replace(/\s/g, "").slice(-4) || "••••"}` : "PayPal"}
                        </p>
                      </div>
                      <button onClick={() => setStep(2)} className="font-['DM_Mono'] text-[10px] tracking-widest uppercase text-[#c9a97a] hover:text-[#f0ebe2] transition-colors">Edit</button>
                    </div>
                  </div>
                  <motion.button onClick={handlePlaceOrder} disabled={processing}
                    className="w-full bg-[#f0ebe2] text-[#0a0905] py-4 font-['DM_Mono'] text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a97a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    whileTap={{ scale: 0.98 }}>
                    {processing ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-[#0a0905]/30 border-t-[#0a0905] rounded-full" />
                        Processing…
                      </>
                    ) : (
                      <><Lock size={13} /> Place Order · {fmt(total)}</>
                    )}
                  </motion.button>
                  <p className="mt-3 font-['DM_Mono'] text-[9px] tracking-wide text-[#8a8272]/40 text-center">
                    By placing this order you agree to VAULTE's Terms & Conditions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="bg-[#111009] border border-[rgba(240,235,226,0.08)] p-5 md:p-6 sticky top-24 self-start">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#f0ebe2] mb-5">Order Summary</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto mb-5">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                  <div className="w-14 h-16 overflow-hidden bg-[#1e1c16] flex-shrink-0 relative">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#8a8272] text-[#0a0905] font-['DM_Mono'] text-[8px] flex items-center justify-center w-5 h-5">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Playfair_Display'] text-sm text-[#f0ebe2] truncate">{item.product.name}</p>
                    <p className="font-['DM_Mono'] text-[10px] text-[#8a8272]">Size {item.size} · {item.color}</p>
                    <p className="font-['DM_Mono'] text-sm text-[#f0ebe2] mt-1">{fmt(item.product.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(240,235,226,0.08)] pt-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="font-['DM_Mono'] text-[11px] text-[#8a8272]">Subtotal</span>
                <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{fmt(cartTotal(cart))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-['DM_Mono'] text-[11px] text-[#8a8272]">Shipping</span>
                <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{shippingFee === 0 ? "Free" : fmt(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[rgba(240,235,226,0.08)]">
                <span className="font-['DM_Mono'] text-xs text-[#f0ebe2] uppercase tracking-widest">Total</span>
                <span className="font-['Playfair_Display'] text-xl text-[#f0ebe2]">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────
function ConfirmationPage({ setView }: { setView: (v: View) => void }) {
  const orderNum = `VLT-${Date.now().toString().slice(-6)}`;
  return (
    <div className="pt-14 md:pt-16 min-h-screen flex items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-lg w-full text-center py-16">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-[#c9a97a] flex items-center justify-center mx-auto mb-8">
          <Check size={28} className="text-[#0a0905]" strokeWidth={2.5} />
        </motion.div>
        <p className="font-['DM_Mono'] text-[10px] tracking-[0.35em] text-[#c9a97a] uppercase mb-4">Order Confirmed</p>
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#f0ebe2] mb-3">
          Thank you.
        </h1>
        <p className="font-['Playfair_Display'] text-xl text-[#f0ebe2]/40 italic mb-8">Your order has been received.</p>
        <div className="border border-[rgba(240,235,226,0.1)] bg-[#111009] p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase">Order Reference</span>
            <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">{orderNum}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase">Estimated Delivery</span>
            <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">5–7 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="font-['DM_Mono'] text-[10px] tracking-widest text-[#8a8272] uppercase">Confirmation</span>
            <span className="font-['DM_Mono'] text-sm text-[#f0ebe2]">Sent to your email</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { icon: Package, label: "Order Placed", done: true },
            { icon: Truck, label: "Being Prepared", done: false },
            { icon: MapPin, label: "Out for Delivery", done: false },
          ].map(({ icon: Icon, label, done }, i) => (
            <div key={label} className="flex items-center gap-4 p-4 border border-[rgba(240,235,226,0.06)]">
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${done ? "bg-[#c9a97a]" : "border border-[rgba(240,235,226,0.1)]"}`}>
                <Icon size={14} className={done ? "text-[#0a0905]" : "text-[#8a8272]"} />
              </div>
              <span className={`font-['DM_Mono'] text-[11px] tracking-widest uppercase ${done ? "text-[#f0ebe2]" : "text-[#8a8272]/50"}`}>{label}</span>
              {done && <Check size={12} className="text-[#c9a97a] ml-auto" />}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => setView("shop")}
            className="flex-1 border border-[rgba(240,235,226,0.15)] text-[#f0ebe2]/60 py-3.5 font-['DM_Mono'] text-[10px] tracking-widest uppercase hover:text-[#f0ebe2] hover:border-[rgba(240,235,226,0.3)] transition-colors">
            Continue Shopping
          </button>
          <button onClick={() => setView("home")}
            className="flex-1 bg-[#f0ebe2] text-[#0a0905] py-3.5 font-['DM_Mono'] text-[10px] tracking-widest uppercase hover:bg-[#c9a97a] transition-colors">
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setViewRaw] = useState<View>("home");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [bagOpen, setBagOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const setView = useCallback((v: View) => {
    setViewRaw(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addToCart = (product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, size, color, qty: 1 }];
    });
    setBagOpen(true);
  };

  const updateQty = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === id && i.size === size
      ? { ...i, qty: Math.max(0, i.qty + delta) }
      : i).filter(i => i.qty > 0));
  };

  const removeItem = (id: string, size: string) =>
    setCart(prev => prev.filter(i => !(i.product.id === id && i.size === size)));

  const handleCheckout = () => { setBagOpen(false); setView("checkout"); };

  return (
    <div className="min-h-screen bg-[#0a0905] text-[#f0ebe2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        ::-webkit-scrollbar { width: 0; height: 0; }
        * { scrollbar-width: none; }
      `}</style>

      <Nav view={view} setView={setView} cart={cart} wishlist={wishlist} openBag={() => setBagOpen(true)} scrolled={scrollY > 50} />

      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} onCheckout={handleCheckout} />

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {view === "home" && (
            <HomePage setView={setView} setSelectedProduct={setSelectedProduct} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          )}
          {view === "shop" && (
            <ShopPage setView={setView} setSelectedProduct={setSelectedProduct} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          )}
          {view === "product" && (
            <ProductPage productId={selectedProduct} setView={setView} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          )}
          {view === "wishlist" && (
            <WishlistPage setView={setView} setSelectedProduct={setSelectedProduct} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          )}
          {view === "checkout" && (
            <CheckoutPage cart={cart} onComplete={() => { setCart([]); setView("confirmation"); }} setView={setView} />
          )}
          {view === "confirmation" && (
            <ConfirmationPage setView={setView} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
