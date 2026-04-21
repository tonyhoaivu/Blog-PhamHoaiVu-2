import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types';
import { BlogService } from '../services/blogService';
import Sidebar from '../components/Sidebar';
import { format } from 'date-fns';
import { Clock, Eye, Share2, Facebook, MessageCircle, ChevronLeft, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      BlogService.getPostBySlug(slug).then(data => {
        setPost(data);
        setLoading(false);
        if (data?.id) {
          BlogService.incrementViews(data.id);
        }
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Không tìm thấy bài viết</h2>
        <Link to="/" className="text-brand font-bold flex items-center justify-center gap-2 hover:gap-3 transition-all">
          <ChevronLeft size={20} /> QUAY LẠI TRANG CHỦ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <article className="lg:col-span-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
          <Link to="/" className="hover:text-brand transition-colors">TRANG CHỦ</Link>
          <span>/</span>
          <span className="text-brand">BÀI VIẾT</span>
        </nav>

        {/* Title & Metadata */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight text-slate-900">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-brand" />
              {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'dd/MM/yyyy') : '-'}
            </span>
            <span className="flex items-center gap-2">
              <Eye size={14} className="text-brand" />
              {post.views || 0} LƯỢT XEM
            </span>
            <span className="flex items-center gap-2">
              <Share2 size={14} className="text-brand" />
              CHIA SẺ
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
          <img 
            src={post.thumbnail || 'https://picsum.photos/seed/article/1200/800'} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-4">
          <Markdown>{post.content}</Markdown>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-4 pt-10 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chia sẻ bài viết:</span>
          <button className="p-2.5 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity">
            <Facebook size={20} />
          </button>
          <button className="p-2.5 rounded-full bg-[#25D366] text-white hover:opacity-80 transition-opacity">
            <MessageCircle size={20} />
          </button>
        </div>
      </article>

      {/* Sidebar */}
      <div className="lg:col-span-4">
        <Sidebar />
      </div>
    </div>
  );
}
