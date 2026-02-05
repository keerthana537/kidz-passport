"use client";

import { useState, useEffect, useMemo } from "react";
import ActivityCard from "@/components/ActivityCard";

interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("rating");
  const [selected, setSelected] = useState<Activity | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=12")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const saved = localStorage.getItem("kidz-favs");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("kidz-favs", JSON.stringify(updated));
  };

  const filteredActivities = useMemo(() => {
    return activities
      .filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === "all" || a.category === category;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sort === "price-high") return b.price - a.price;
        if (sort === "price-low") return a.price - b.price;
        return b.rating - a.rating;
      });
  }, [activities, search, category, sort]);

  const categories = ["all", ...new Set(activities.map((a) => a.category))];

  if (loading) return <div className="p-20 text-center font-bold text-indigo-400 animate-pulse">Loading amazing activities...</div>;

  return (
    /* Changed back to the soft gradient background */
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Colorful Gradient Header */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text italic uppercase">
            Kidz Passport Explorer
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px]">Premium Kids Marketplace</p>
        </header>

        {/* Floating Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="text"
            placeholder="Search destination or activity..."
            className="flex-1 p-4 px-6 rounded-2xl border-none shadow-lg shadow-indigo-100/50 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <select className="flex-1 md:w-40 p-4 rounded-2xl bg-white shadow-lg shadow-indigo-100/50 border-none text-xs font-bold uppercase tracking-wider outline-none cursor-pointer" onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
            <select className="flex-1 md:w-48 p-4 rounded-2xl bg-white shadow-lg shadow-indigo-100/50 border-none text-xs font-bold uppercase tracking-wider outline-none cursor-pointer" onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Top Rated ⭐</option>
              <option value="price-low">Lowest Price 💰</option>
              <option value="price-high">Highest Price 💎</option>
            </select>
          </div>
        </div>

        {/* Grid: Stays at 4 columns for clean look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isFavorite={favorites.includes(activity.id)}
              onToggleFavorite={() => toggleFavorite(activity.id)}
              onClick={() => setSelected(activity)}
            />
          ))}
        </div>

        {/* Modal: Colorful accents added back */}
        {selected && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-[50px] p-8 relative shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center font-bold">✕</button>
              
              <div className="text-center">
                <div className="aspect-square bg-slate-50 rounded-[40px] mb-6 flex items-center justify-center overflow-hidden">
                  <img src={selected.thumbnail} alt="" className="max-h-full p-6 object-contain" />
                </div>
                
                <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tight text-slate-800">{selected.title}</h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{selected.description}</p>
                
                <div className="flex justify-between items-center bg-indigo-50/50 p-5 rounded-3xl mb-8 border border-indigo-100">
                  <span className="text-3xl font-black text-indigo-600">${selected.price}</span>
                  <span className="font-bold text-slate-700">★ {selected.rating}</span>
                </div>
                
                <button 
                  onClick={() => alert("Success! Activity Booked 🎉")}
                  className="w-full py-5 rounded-3xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Book Activity Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}