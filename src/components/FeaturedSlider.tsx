import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { BlogService } from '../services/blogService';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function FeaturedSlider() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BlogService.getFeaturedPosts(5).then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  if (loading || posts.length === 0) return null;

  const current = posts[currentIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px]">
      {/* Featured Big */}
      <div className="relative group overflow-hidden rounded-sm blogspot-card">
        <img 
          src={posts[0]?.thumbnail || 'https://picsum.photos/seed/featured/800/600'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <Link to={`/p/${posts[0]?.slug}`} className="text-sm font-bold leading-tight hover:text-brand-light transition-colors line-clamp-2">
            {posts[0]?.title || 'Youtube Vanced chặn quảng cáo chạy nhạc nền'}
          </Link>
          <p className="text-[10px] text-white/60 mt-1 uppercase font-bold">Jan 01, 2024</p>
        </div>
      </div>

      {/* Grid Small */}
      <div className="grid grid-cols-2 gap-2">
        {posts.slice(1, 4).concat([{} as any, {} as any, {} as any]).slice(0, 4).map((post, i) => (
          <div key={post.id || i} className="relative group overflow-hidden rounded-sm blogspot-card">
            <img 
              src={post.thumbnail || `https://picsum.photos/seed/p${i}/400/300`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <Link to={`/p/${post.slug}`} className="text-[10px] font-bold line-clamp-2 leading-tight">
                {post.title || 'Bài viết nổi bật ' + (i + 1)}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
