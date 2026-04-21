import React, { useState, useEffect } from 'react';
import { Search, List, MessageSquare, ExternalLink, Hash } from 'lucide-react';
import { BlogService } from '../services/blogService';
import { Category, Ad } from '../types';
import { Link } from 'react-router-dom';

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
      {/* Search Widget */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Search size={20} className="text-brand" />
          Tìm kiếm
        </h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Nhập từ khóa..." 
            className="w-full bg-slate-100 border-none rounded-lg py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-brand outline-none text-sm"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Categories Widget */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <List size={20} className="text-brand" />
          Chủ đề hay
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/c/${cat.slug}`}
              className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-brand">
                <Hash size={14} className="text-slate-300 group-hover:text-brand/50" />
                {cat.name}
              </div>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                -
              </span>
            </Link>
          ))}
          {categories.length === 0 && !loading && (
            <p className="text-sm text-slate-400 italic">Chưa có danh mục</p>
          )}
        </div>
      </div>

      {/* Ads Widget */}
      {ads.map((ad) => (
        <div key={ad.id} className="glass-card overflow-hidden">
          <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative">
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 text-[9px] text-white rounded uppercase tracking-widest backdrop-blur-sm">
                Quảng cáo
              </div>
            </div>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-sm font-medium line-clamp-1">{ad.title}</span>
              <ExternalLink size={14} className="text-slate-400" />
            </div>
          </a>
        </div>
      ))}

      {/* Social/Community Widget */}
      <div className="glass-card p-6 bg-linear-to-br from-brand/5 to-slate-50">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-brand" />
          Giao lưu - Kết bạn
        </h3>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Trao đổi liên kết với cộng đồng Blogger Việt. Tham gia cùng chúng tôi để phát triển blog!
        </p>
        <button className="w-full py-2 bg-brand text-white text-sm font-bold rounded-lg shadow-sm shadow-brand/20 hover:bg-brand-hover transition-colors">
          Tham gia ngay
        </button>
      </div>
    </aside>
  );
}
