"use client";

import { useState, useEffect, useMemo } from "react";
import ActivityCard from "@/components/ActivityCard";

// Interface fixes the TypeScript build errors you saw earlier
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

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Loading Activities...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-bold">Error loading activities.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">

        
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
          text-transparent bg-clip-text px-2">
            KIDZ PASSPORT EXPLORER
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] md:text-xs">
            Premium Kids Marketplace
          </p>
        </header>

       
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8">
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full md:flex-1 p-4 rounded-2xl border border-indigo-200 
            shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="flex-1 md:w-40 p-4 rounded-2xl bg-white shadow-sm border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>

            <select
              className="flex-1 md:w-48 p-4 rounded-2xl bg-white shadow-sm border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating">Top Rated </option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>

       
        {filteredActivities.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-indigo-200">
            <p className="text-slate-500 font-bold px-4">No activities found matching your search.</p>
          </div>
        )}

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 md:p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[35px] md:rounded-[40px] p-6 md:p-8 relative shadow-2xl border border-indigo-100 transform animate-in zoom-in duration-300 max-h-[95vh] overflow-y-auto">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold hover:bg-slate-200 transition-colors z-10"
              >✕</button>

              <div className="aspect-square bg-slate-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center">
                <img src={selected.thumbnail} alt={selected.title} className="max-h-full object-contain p-4" />
              </div>

              <h2 className="text-xl md:text-2xl font-black mb-2 text-slate-800 tracking-tight leading-tight">
                {selected.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {selected.description}
              </p>

              <div className="flex justify-between items-center mb-6 md:mb-8 bg-indigo-50 p-4 md:p-5 rounded-3xl">
                <span className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter">
                  ${selected.price}
                </span>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-bold text-slate-700">{selected.rating}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Booking "${selected.title}" Confirmed 🎉`)}
                className="w-full py-4 md:py-5 rounded-3xl font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg active:scale-95 transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}