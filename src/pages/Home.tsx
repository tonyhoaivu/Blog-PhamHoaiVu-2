import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Post, MenuItem, SiteSettings } from '../types';
import { BlogService } from '../services/blogService';
import FeaturedSlider from '../components/FeaturedSlider';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { LayoutGrid, List as ListIcon, Loader2, ChevronRight, ChevronDown } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BlogService.getPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  // Helper to render a category block
  const CategoryBlock = ({ title, posts, layout = 'grid' }: { title: string, posts: Post[], layout?: 'grid' | 'half' }) => {
    if (posts.length === 0) return null;
    
    return (
      <div className="widget-container">
        <h3 className="widget-title">{title}</h3>
        <div className={`mt-4 ${layout === 'half' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-3 gap-2'}`}>
          {posts.map((post, i) => (
            layout === 'half' ? (
              <Link key={post.id || i} to={`/p/${post.slug}`} className="flex gap-3 group">
                <div className="w-24 h-16 bg-slate-100 blogspot-card shrink-0">
                  <img 
                    src={post.thumbnail || `https://picsum.photos/seed/cat${i}/200/150`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-[10px] leading-tight">
                  <p className="font-bold text-slate-700 group-hover:text-brand transition-colors line-clamp-2">{post.title}</p>
                  <p className="text-slate-400 mt-1">
                    {post.createdAt?.seconds 
                      ? format(new Date(post.createdAt.seconds * 1000), 'MMM dd, yyyy') 
                      : 'Mới'}
                  </p>
                </div>
              </Link>
            ) : (
              <Link key={post.id || i} to={`/p/${post.slug}`} className="group">
                <div className="aspect-video bg-slate-100 blogspot-card mb-2">
                  <img 
                    src={post.thumbnail || `https://picsum.photos/seed/grid${i}/300/200`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[9px] font-bold text-slate-700 cursor-pointer group-hover:text-brand transition-colors line-clamp-2 leading-tight uppercase tracking-tighter">
                  {post.title}
                </p>
                <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold">
                  {post.createdAt?.seconds 
                    ? format(new Date(post.createdAt.seconds * 1000), 'MMM dd, yyyy') 
                    : 'Mới'}
                </p>
              </Link>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section>
        {loading ? (
          <div className="h-[400px] bg-slate-100 animate-pulse rounded-sm blogspot-card" />
        ) : posts.length > 0 ? (
          <FeaturedSlider />
        ) : null}
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-brand" size={40} />
              <p className="text-slate-400 font-medium italic">Đang tải bố cục...</p>
            </div>
          ) : posts.length > 0 ? (
            <>
              {/* Filter posts by some criteria if needed, or just show them in blocks */}
              <CategoryBlock 
                title="BÀI VIẾT MỚI" 
                posts={posts.slice(0, 6)} 
                layout="half"
              />

              {posts.length > 6 && (
                <CategoryBlock 
                  title="XEM THÊM" 
                  posts={posts.slice(6, 12)} 
                  layout="grid"
                />
              )}

              <div className="flex justify-center border-t border-slate-100 pt-8">
                <button className="blogspot-btn">Tất cả bài viết</button>
              </div>
            </>
          ) : (
            <div className="blogspot-card p-12 text-center border-dashed border-2 border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hiện tại chưa có bài viết nào.</p>
              <p className="text-slate-300 text-[10px] mt-2">Vui lòng quay lại sau hoặc đăng nhập vào hệ thống Admin để thêm bài viết mới.</p>
              <Link to="/admin" className="inline-block mt-6 blogspot-btn">Viết bài ngay</Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
