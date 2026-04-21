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
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img 
            src={current.thumbnail || 'https://picsum.photos/seed/blog/1920/1080'} 
            alt={current.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3 text-sm font-medium">
                <span className="px-2 py-1 bg-brand rounded-md uppercase tracking-wider text-[10px]">
                  Nổi bật
                </span>
                <span className="flex items-center gap-1 opacity-80">
                  <Clock size={14} />
                  {current.createdAt?.seconds ? format(new Date(current.createdAt.seconds * 1000), 'dd/MM/yyyy') : 'Mới'}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 max-w-3xl leading-tight">
                <Link to={`/p/${current.slug}`} className="hover:text-brand transition-colors">
                  {current.title}
                </Link>
              </h2>
              <p className="text-white/70 line-clamp-2 max-w-2xl mb-6">
                {current.excerpt}
              </p>
              <Link 
                to={`/p/${current.slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-brand hover:text-white transition-all transform hover:scale-105"
              >
                Đọc ngay
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
