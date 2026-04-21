import React from 'react';
import { Post } from '../types';
import { format } from 'date-fns';
import { Clock, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  variant?: 'list' | 'grid';
  key?: string;
}

export default function PostCard({ post, variant = 'grid' }: PostCardProps) {
  const dateStr = post.createdAt?.seconds 
    ? format(new Date(post.createdAt.seconds * 1000), 'dd/MM/yyyy') 
    : 'Mới đăng';

  if (variant === 'list') {
    return (
      <div className="glass-card group flex flex-col md:flex-row gap-6 p-4 blog-card-hover">
        <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
          <img 
            src={post.thumbnail || 'https://picsum.photos/seed/tech/400/300'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col flex-grow min-w-0 py-1">
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-brand">BLOGSPOT</span>
            <span>/</span>
            <span>{dateStr}</span>
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-brand transition-colors">
            <Link to={`/p/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                5 min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={13} />
                {post.views || 0}
              </span>
            </div>
            <Link 
              to={`/p/${post.slug}`}
              className="text-brand text-xs font-bold flex items-center gap-0.5 hover:gap-1.5 transition-all"
            >
              CHI TIẾT <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card group overflow-hidden blog-card-hover">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.thumbnail || 'https://picsum.photos/seed/tech/400/300'} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded">
            Thủ thuật
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-2">
          <Clock size={12} />
          {dateStr}
        </div>
        <h3 className="font-display font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-brand transition-colors">
          <Link to={`/p/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        <Link 
          to={`/p/${post.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-brand transition-colors uppercase tracking-wider"
        >
          Xem thêm <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
