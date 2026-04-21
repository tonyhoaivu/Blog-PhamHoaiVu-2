import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, List, MessageSquare, ExternalLink, Hash, ChevronRight, ChevronDown } from 'lucide-react';
import { BlogService } from '../services/blogService';
import { Category, Ad } from '../types';

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      BlogService.getCategories(),
      BlogService.getAds('sidebar')
    ]).then(([cats, sidebarAds]) => {
      setCategories(cats);
      setAds(sidebarAds);
      setLoading(false);
    });
  }, []);

  return (
    <aside className="flex flex-col gap-8">
      {/* Tabbed Widget */}
      <div className="bg-white border-t-2 border-brand pt-2">
        <div className="flex text-[9px] font-bold uppercase tracking-widest border-b border-slate-100 mb-4">
          <button className="px-3 py-2 border-b-2 border-brand text-brand">Popular</button>
          <button className="px-3 py-2 text-slate-400 hover:text-brand transition-colors">Recent</button>
          <button className="px-3 py-2 text-slate-400 hover:text-brand transition-colors">Comments</button>
        </div>
        <div className="space-y-3">
          {/* No demo posts, only show real data if available */}
          <p className="text-[10px] text-slate-400 italic">Chưa có dữ liệu bài viết.</p>
        </div>
      </div>

      {/* Categories Widget */}
      <div className="widget-container">
        <h3 className="widget-title">
          <List size={10} strokeWidth={3} />
          Có thể bạn thích
        </h3>
        <div className="flex flex-col text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
          {categories.length > 0 ? categories.map((cat, i) => (
            <Link key={cat.id || i} to={`/c/${cat.slug}`} className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-200 hover:text-brand cursor-pointer group">
              <div className="flex items-center gap-1">
                <ChevronRight size={10} className="text-slate-300 group-hover:text-brand" />
                <span>{cat.name}</span>
              </div>
              <ChevronDown size={10} className="text-slate-300 -rotate-90" />
            </Link>
          )) : (
            <p className="py-2 text-slate-400 italic">Chưa có danh mục.</p>
          )}
        </div>
      </div>

      {/* PC Software Widget */}
      <div className="widget-container">
        <h3 className="widget-title">Phần mềm cần thiết cho PC</h3>
        <div className="space-y-4 pt-2">
          {/* Real data would be mapped here from database */}
          <p className="text-[10px] text-slate-400 italic">Chưa có dữ liệu phần mềm.</p>
        </div>
      </div>
    </aside>
  );
}
