import React, { useState, useEffect } from 'react';
import { Post, Ad, MenuItem, Category } from '../types';
import { BlogService } from '../services/blogService';
import { 
  FileText, 
  Plus, 
  Settings as SettingsIcon, 
  Layout, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const [tab, setTab] = useState<'posts' | 'menu' | 'ads' | 'categories'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allPosts, allAds, allMenu, allCats] = await Promise.all([
        BlogService.getPosts(false),
        BlogService.getAds(),
        BlogService.getMenuItems(),
        BlogService.getCategories()
      ]);
      setPosts(allPosts);
      setAds(allAds);
      setMenuItems(allMenu);
      setCategories(allCats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) return;
    
    setSaving(true);
    try {
      if (editingPost.id) {
        await BlogService.updatePost(editingPost.id, editingPost);
      } else {
        await BlogService.createPost({
          title: editingPost.title,
          slug: editingPost.slug,
          content: editingPost.content || '',
          excerpt: editingPost.excerpt || '',
          thumbnail: editingPost.thumbnail || '',
          categoryId: editingPost.categoryId || 'default',
          authorId: 'admin', // Placeholder
          isFeatured: editingPost.isFeatured || false,
          status: editingPost.status || 'published'
        });
      }
      setIsEditorOpen(false);
      setEditingPost(null);
      loadAllData();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      await BlogService.deletePost(id);
      loadAllData();
    }
  };

  const openEditor = (post?: Post) => {
    setEditingPost(post || {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      thumbnail: '',
      categoryId: '',
      isFeatured: false,
      status: 'published'
    });
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Bảng Điều Khiển</h1>
          <p className="text-slate-500 text-sm">Chào mừng trở lại! Hôm nay bạn muốn quản lý gì?</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Viết Bài Mới
        </button>
      </header>

      {/* Tabs */}
      <nav className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'posts', label: 'Bài viết', icon: FileText },
          { id: 'menu', label: 'Menu', icon: Layout },
          { id: 'categories', label: 'Chủ đề', icon: ChevronRight },
          { id: 'ads', label: 'Quảng cáo', icon: ImageIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === item.id ? 'bg-white shadow-sm text-brand' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="py-40 flex justify-center">
          <Loader2 className="animate-spin text-brand" size={40} />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {tab === 'posts' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tiêu đề</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Ngày đăng</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.thumbnail || 'https://picsum.photos/seed/thumb/100/100'} 
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{post.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs text-slate-600">
                        {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'dd/MM/yyyy') : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {post.status === 'published' ? <CheckCircle2 size={10} /> : null}
                        {post.status === 'published' ? 'Công khai' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditor(post)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id!)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab !== 'posts' && (
            <div className="p-20 text-center text-slate-400 italic">
              Tính năng {tab} đang được hoàn thiện... (Demo Admin)
            </div>
          )}
        </div>
      )}

      {/* Post Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                {editingPost?.id ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
              </h2>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Đóng
              </button>
            </div>
            <form onSubmit={handleSavePost} className="flex-grow overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiêu đề</label>
                  <input 
                    type="text"
                    required
                    value={editingPost?.title || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm"
                    placeholder="VD: Cách tạo Blogspot đẹp..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug (URL)</label>
                  <input 
                    type="text"
                    required
                    value={editingPost?.slug || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm font-mono"
                    placeholder="vd-cach-tao-blogspot"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ảnh Thumbnail (URL)</label>
                  <input 
                    type="url"
                    value={editingPost?.thumbnail || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, thumbnail: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</label>
                  <select 
                    value={editingPost?.status || 'published'}
                    onChange={e => setEditingPost(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm font-bold"
                  >
                    <option value="published">Công khai</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mô tả ngắn</label>
                <textarea 
                  rows={2}
                  value={editingPost?.excerpt || ''}
                  onChange={e => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm"
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nội dung (Markdown)</label>
                  <span className="text-[10px] text-slate-400 italic">Hỗ trợ định dạng văn bản nâng cao</span>
                </div>
                <textarea 
                  rows={10}
                  required
                  value={editingPost?.content || ''}
                  onChange={e => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-xl py-4 px-4 focus:ring-2 focus:ring-brand outline-none text-sm font-mono leading-relaxed"
                  placeholder="# Tiêu đề lớn..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="featured"
                  checked={editingPost?.isFeatured || false}
                  onChange={e => setEditingPost(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-5 h-5 rounded text-brand focus:ring-brand"
                />
                <label htmlFor="featured" className="text-sm font-bold text-slate-700">Đăng lên mục Nổi bật (Slider)</label>
              </div>
            </form>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSavePost}
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-hover disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : null}
                Lưu Bài Viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
