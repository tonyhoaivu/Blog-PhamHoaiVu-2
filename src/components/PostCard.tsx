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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 group flex flex-col md:flex-row gap-6 p-4 blog-card-hover">
        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-lg">
          <img 
            src={post.thumbnail || 'https://picsum.photos/seed/tech/400/300'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col flex-grow min-w-0 py-1">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span className="text-brand">BLOGSPOT</span>
            <span className="text-slate-200">•</span>
            <span>{dateStr}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand transition-colors leading-snug">
            <Link to={`/p/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2.5} />
                5 min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={12} strokeWidth={2.5} />
                {post.views || 0} views
              </span>
            </div>
            <Link 
              to={`/p/${post.slug}`}
              className="text-brand text-xs font-bold flex items-center gap-1 transition-all"
            >
              CHI TIẾT <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 group overflow-hidden blog-card-hover">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={post.thumbnail || 'https://picsum.photos/seed/tech/400/300'} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded">
            Thủ thuật
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
          <Clock size={12} strokeWidth={2.5} />
          {dateStr}
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-brand transition-colors min-h-[3.5rem]">
          <Link to={`/p/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        <Link 
          to={`/p/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-brand transition-colors uppercase tracking-widest"
        >
          Xem thêm <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
