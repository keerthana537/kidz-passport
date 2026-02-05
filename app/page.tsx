"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activities, setActivities] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [search, setSearch] = useState(searchParams.get('q') || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState(searchParams.get('cat') || "all");
  const [sort, setSort] = useState(searchParams.get('sort') || "");

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem('kidz_favs') || '[]');
    setFavorites(savedFavs);

   
    fetch('https://dummyjson.com/products?limit=12')
      .then(res => res.json())
      .then(data => {
        setActivities(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category !== 'all') params.set('cat', category);
    if (sort) params.set('sort', sort);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [search, category, sort, router]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('kidz_favs', JSON.stringify(updated));
  };

  const filteredActivities = useMemo(() => {
    let result = activities.filter((item: any) => 
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      (category === "all" || item.category === category)
    );

    if (sort === "price-low") result.sort((a: any, b: any) => a.price - b.price);
    if (sort === "price-high") result.sort((a: any, b: any) => b.price - a.price);
    if (sort === "rating") result.sort((a: any, b: any) => b.rating - a.rating);

    return result;
  }, [debouncedSearch, category, sort, activities]);

  const categories = Array.from(new Set(activities.map((a: any) => a.category)));

  if (loading) return <div className="flex h-screen items-center justify-center font-black text-indigo-600 animate-pulse">✨ LOADING MAGIC...</div>;

  return (
    <main className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(circle_at_top_left,_#e0e7ff_0%,_#f8fafc_50%,_#fae8ff_100%)] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-12 text-center text-slate-900 tracking-tight italic drop-shadow-md">🚀 Kidz Passport</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" role="search">
          <input 
            type="text" 
            aria-label="Search activities"
            placeholder="Search activities..." 
            className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl focus:ring-4 focus:ring-indigo-200 outline-none transition-all text-slate-800 font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select 
            aria-label="Filter by category"
            className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl text-slate-700 outline-none font-bold cursor-pointer transition-all" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
          </select>

          <select 
            aria-label="Sort activities"
            className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white shadow-xl text-slate-700 outline-none font-bold cursor-pointer transition-all" 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredActivities.map((item: any) => (
            <div 
              key={item.id} 
              onClick={() => setSelected(item)}
              className="group cursor-pointer bg-white rounded-[45px] p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col relative"
            >
              <button 
                onClick={(e) => toggleFavorite(e, item.id)}
                aria-label={favorites.includes(item.id) ? "Remove from favorites" : "Add to favorites"}
                className="absolute top-8 right-8 z-10 text-3xl transition-transform hover:scale-125 active:scale-90"
              >
                {favorites.includes(item.id) ? "❤️" : "🤍"}
              </button>

              <div className="h-48 rounded-3xl overflow-hidden mb-6 bg-slate-50 flex items-center justify-center p-4">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-black text-2xl text-slate-800 line-clamp-1 mb-1 leading-tight">{item.title}</h3>
              <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-6">{item.category}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">${item.price}</span>
                {/* N/A HANDLING FIXED HERE */}
                <span className="bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl text-sm font-black shadow-md border border-amber-300">
                  ⭐ {item.rating && item.rating > 0 ? item.rating : 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-[60px] border-[12px] border-slate-900 max-w-sm w-full overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 hover:text-red-500 transition-all z-10" aria-label="Close modal">✕</button>
            <div className="p-8 pt-10 text-center">
                <div className="aspect-square bg-slate-50 rounded-[45px] mb-8 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                    <img src={selected.thumbnail} alt="" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2 italic leading-tight">{selected.title}</h2>
                <p className="text-indigo-600 font-black mb-4 uppercase text-sm tracking-widest">{selected.category}</p>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{selected.description}</p>
                <div className="flex items-center justify-between mb-10">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">${selected.price}</span>
                 
                  <span className="bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl font-black shadow-md">
                    ⭐ {selected.rating && selected.rating > 0 ? selected.rating : 'N/A'}
                  </span>
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-[28px] font-black text-xl shadow-xl hover:brightness-110 active:scale-95 transition-all">Book Now</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}