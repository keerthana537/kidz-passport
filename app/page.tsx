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

  if (loading) return <div className="p-20 text-center font-medium text-slate-400">Loading fine activities...</div>;

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Sleeker Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Kidz Passport</h1>
          <p className="text-slate-500 text-sm">Discover and book the best activities for children.</p>
        </header>

        {/* Minimalist Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 border-b border-slate-100 pb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search destination or activity..."
              className="w-full pl-4 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select className="p-3 px-6 rounded-full bg-slate-50 border-none text-xs font-bold uppercase tracking-wider outline-none cursor-pointer" onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select className="p-3 px-6 rounded-full bg-slate-50 border-none text-xs font-bold uppercase tracking-wider outline-none cursor-pointer" onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price-low">Lowest Price</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Grid: 4 columns on desktop makes images smaller and cleaner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
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

        {/* Elegant Modal */}
        {selected && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 font-bold">Close ✕</button>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-slate-50 rounded-2xl p-4 aspect-square flex items-center justify-center">
                  <img src={selected.thumbnail} alt="" className="max-h-full object-contain" />
                </div>
                
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block">{selected.category}</span>
                  <h2 className="text-2xl font-bold mb-4 leading-tight">{selected.title}</h2>
                  <p className="text-slate-500 text-sm mb-8">{selected.description}</p>
                  
                  <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-100">
                    <span className="text-3xl font-light">${selected.price}</span>
                    <span className="text-sm font-bold">★ {selected.rating}</span>
                  </div>
                  
                  <button className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-colors">
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}