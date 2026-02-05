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

interface ApiResponse {
  products: Activity[];
}

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("rating");
  const [selected, setSelected] = useState<Activity | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=12")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setActivities(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    const saved = localStorage.getItem("kidz-favs");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
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

  if (loading) return <div className="p-20 text-center font-bold">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 text-center">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2
          bg-gradient-to-r from-indigo-600 to-pink-500
          text-transparent bg-clip-text uppercase italic">
            KIDZ PASSPORT EXPLORER
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold tracking-[0.2em] uppercase">
            Premium Kids Marketplace
          </p>
        </header>

        
        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="Search activities..."
            className="flex-1 p-3 md:p-4 rounded-xl border border-slate-200 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <select className="flex-1 md:w-32 p-3 md:p-4 rounded-xl bg-white border border-slate-200 text-sm outline-none" onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
            <select className="flex-1 md:w-40 p-3 md:p-4 rounded-xl bg-white border border-slate-200 text-sm outline-none" onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price Low</option>
              <option value="price-high">Price High</option>
            </select>
          </div>
        </div>

        
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

       
        {selected && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-[40px] p-6 md:p-10 relative shadow-2xl animate-in zoom-in duration-200">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full font-bold">✕</button>
              
              <div className="text-center">
                
                <div className="w-full h-48 md:h-64 flex items-center justify-center mb-6 bg-slate-50 rounded-3xl overflow-hidden">
                  <img src={selected.thumbnail} alt="" className="max-h-full max-w-full object-contain p-4" />
                </div>
                
                <h2 className="text-xl md:text-2xl font-black mb-2 uppercase italic leading-tight">{selected.title}</h2>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">{selected.description}</p>
                
                <div className="flex justify-between items-center bg-slate-50 p-5 rounded-3xl mb-6">
                  <span className="text-2xl font-black text-indigo-600">${selected.price}</span>
                  <span className="font-bold text-slate-700">★ {selected.rating}</span>
                </div>
                
                <button className="w-full py-4 rounded-2xl font-black bg-slate-900 text-white uppercase tracking-widest hover:bg-indigo-600 transition-all">
                  Book Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}