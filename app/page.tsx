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

  // FIXED: Alert for Like/Unlike
  const toggleFavorite = (id: number) => {
    const isAdding = !favorites.includes(id);
    const updated = isAdding ? [...favorites, id] : favorites.filter(f => f !== id);
    setFavorites(updated);
    localStorage.setItem("kidz-favs", JSON.stringify(updated));
    alert(isAdding ? "Added to your Favorites! ❤️" : "Removed from Favorites 🤍");
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

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-indigo-50">
      <div className="text-2xl font-black text-indigo-600 animate-pulse">LOADING...</div>
    </div>
  );

  return (
    /* NICE COLOR BACKGROUND */
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 text-slate-900">
      
      {/* FITS THE PAGE: Uses w-full with side padding */}
      <div className="w-full px-4 md:px-10 py-8 md:py-16">
        
        {/* CENTERED HEADING IN MIDDLE */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text uppercase italic leading-none">
            Kidz Passport Explorer
          </h1>
          <p className="text-indigo-400 font-black uppercase tracking-[0.5em] text-[10px] md:text-sm">
            Premium Kids Marketplace
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Search activities..."
            className="flex-1 p-5 px-8 rounded-3xl border-none shadow-2xl shadow-indigo-200/50 text-sm outline-none focus:ring-4 focus:ring-indigo-400/20 bg-white/90"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-3">
            <select className="flex-1 md:w-44 p-5 rounded-3xl bg-white shadow-xl border-none text-xs font-black uppercase tracking-widest outline-none" onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
            <select className="flex-1 md:w-48 p-5 rounded-3xl bg-white shadow-xl border-none text-xs font-black uppercase tracking-widest outline-none" onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Top Rated ⭐</option>
              <option value="price-low">Lowest Price 💰</option>
              <option value="price-high">Highest Price 💎</option>
            </select>
          </div>
        </div>

        {/* NOT FOUND LOGIC */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-32 bg-white/40 backdrop-blur-md rounded-[50px] border-4 border-dashed border-indigo-200">
            <h2 className="text-2xl font-black text-indigo-900 mb-2 italic">NOT FOUND</h2>
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">No activity matches your search: "{search}"</p>
          </div>
        ) : (
          /* 4 GRID COLUMNS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        )}

        {/* MODAL: Fixed small size so it's not giant */}
        {selected && (
          <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            {/* max-w-md keeps the product page narrow and elegant */}
            <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[50px] p-8 md:p-10 relative shadow-2xl animate-in zoom-in duration-300">
              <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black hover:bg-red-50 transition-all">✕</button>
              
              <div className="text-center">
                {/* Fixed height image container */}
                <div className="w-full h-56 bg-slate-50 rounded-[40px] mb-6 flex items-center justify-center overflow-hidden shadow-inner">
                  <img src={selected.thumbnail} alt="" className="max-h-full p-6 object-contain" />
                </div>
                
                <h2 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-slate-900">{selected.title}</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">{selected.description}</p>
                
                <div className="flex justify-between items-center bg-indigo-50 p-5 rounded-[30px] mb-8 border border-indigo-100">
                  <span className="text-3xl font-black text-indigo-600">${selected.price}</span>
                  <div className="bg-white px-4 py-1 rounded-full text-sm font-black text-slate-700">★ {selected.rating}</div>
                </div>
                
                <button 
                  onClick={() => alert("Success! Activity Booked 🎉")}
                  className="w-full py-5 rounded-[25px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
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