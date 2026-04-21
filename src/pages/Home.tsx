import React, { useState, useEffect } from 'react';
import { Post, MenuItem, SiteSettings } from '../types';
import { BlogService } from '../services/blogService';
import FeaturedSlider from '../components/FeaturedSlider';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    BlogService.getPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        <FeaturedSlider />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Posts List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h2 className="font-display font-bold text-2xl flex items-center gap-2">
              <span className="w-2 h-8 bg-brand rounded-full" />
              Bài viết mới nhất
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand' : 'text-slate-500'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand' : 'text-slate-500'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-brand" size={40} />
              <p className="text-slate-400 font-medium italic">Đang tải bài viết...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
              {posts.map(post => (
                <PostCard key={post.id} post={post} variant={viewMode} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-slate-400">Chưa có bài viết nào được đăng.</p>
            </div>
          )}
          
          {/* Pagination Placeholder */}
          {!loading && posts.length > 0 && (
            <div className="flex justify-center pt-8">
              <button className="px-8 py-3 glass-card text-brand font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
                Xem thêm bài viết
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
