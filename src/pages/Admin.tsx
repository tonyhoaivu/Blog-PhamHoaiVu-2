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
  CheckCircle2,
  Globe,
  Tag,
  Menu as MenuIcon,
  Monitor
} from 'lucide-react';
import { format } from 'date-fns';
import { SiteSettings } from '../types';

export default function Admin() {
  const [tab, setTab] = useState<'posts' | 'menu' | 'ads' | 'categories' | 'settings'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ siteName: '', description: '', logo: '', footerText: '' });
  const [loading, setLoading] = useState(true);
  
  // Editor States
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [editingAd, setEditingAd] = useState<Partial<Ad> | null>(null);
  const [editingMenu, setEditingMenu] = useState<Partial<MenuItem> | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allPosts, allAds, allMenu, allCats, siteSettings] = await Promise.all([
        BlogService.getPosts(false),
        BlogService.getAllAds(),
        BlogService.getMenuItems(),
        BlogService.getCategories(),
        BlogService.getSettings()
      ]);
      setPosts(allPosts);
      setAds(allAds);
      setMenuItems(allMenu);
      setCategories(allCats);
      setSettings(siteSettings);
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
          authorId: 'admin', 
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

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name || !editingCat?.slug) return;
    setSaving(true);
    try {
      if (editingCat.id) await BlogService.updateCategory(editingCat.id, editingCat);
      else await BlogService.createCategory({ name: editingCat.name, slug: editingCat.slug, order: editingCat.order || 0 });
      setEditingCat(null);
      loadAllData();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd?.title || !editingAd?.imageUrl) return;
    setSaving(true);
    try {
      if (editingAd.id) await BlogService.updateAd(editingAd.id, editingAd);
      else await BlogService.createAd({ 
        title: editingAd.title, 
        imageUrl: editingAd.imageUrl, 
        link: editingAd.link || '', 
        position: editingAd.position || 'sidebar', 
        isActive: editingAd.isActive !== undefined ? editingAd.isActive : true 
      });
      setEditingAd(null);
      loadAllData();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu?.label || !editingMenu?.link) return;
    setSaving(true);
    try {
      if (editingMenu.id) await BlogService.updateMenuItem(editingMenu.id, editingMenu);
      else await BlogService.createMenuItem({ label: editingMenu.label, link: editingMenu.link, order: editingMenu.order || 0 });
      setEditingMenu(null);
      loadAllData();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await BlogService.updateSettings(settings);
      alert('Đã cập nhật cài đặt hệ thống!');
      loadAllData();
    } catch (error) { console.error(error); }
    finally { setSaving(false); }
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
    <div className="flex -mx-4 md:-mx-8 -my-8 min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center font-bold text-white uppercase">{settings.siteName?.slice(0, 2) || 'PV'}</div>
            <span className="font-bold text-white text-lg tracking-tight">Admin Dashboard</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Quản trị chính</div>
          
          <button 
            onClick={() => setTab('posts')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${tab === 'posts' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <FileText size={18} /> Quản lý Bài viết
          </button>
          
          <button 
            onClick={() => setTab('categories')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${tab === 'categories' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <Tag size={18} /> Chủ đề & Danh mục
          </button>

          <button 
            onClick={() => setTab('ads')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${tab === 'ads' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <Monitor size={18} /> Trang quảng cáo
          </button>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4 px-2">Hệ thống</div>
          
          <button 
            onClick={() => setTab('menu')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${tab === 'menu' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <MenuIcon size={18} /> Tùy chỉnh Menu
          </button>

          <button 
            onClick={() => setTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${tab === 'settings' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
          >
            <SettingsIcon size={18} /> Cài đặt chung
          </button>
        </nav>
        
        <div className="p-4 bg-slate-950/30 m-4 rounded-lg border border-slate-800 text-[10px]">
          <p className="text-slate-400 mb-2 uppercase font-bold tracking-widest">Hệ thống</p>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
             <CheckCircle2 size={10} />
             <span>Ổn định</span>
          </div>
          <p className="text-slate-500">Node v20.x | React v19.x</p>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="capitalize font-bold text-brand uppercase tracking-tighter">{tab}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Tất cả dữ liệu</span>
          </div>
          <div className="flex gap-3">
            {tab === 'posts' && (
              <button 
                onClick={() => openEditor()}
                className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand/20 transition-all hover:scale-105"
              >
                <Plus size={18} /> Đăng bài mới
              </button>
            )}
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {tab === 'posts' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng bài viết</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900">{posts.length}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Trạng thái Site</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-xl font-bold text-emerald-600 uppercase tracking-tighter">Hoạt động</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng danh mục</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-3xl font-bold text-slate-900">{categories.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 uppercase tracking-tighter">Quản lý Bài viết</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Bài viết</th>
                        <th className="px-6 py-4">Danh mục</th>
                        <th className="px-6 py-4">Ngày đăng</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Lựa chọn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {posts.map(post => (
                        <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden shadow-sm">
                                <img src={post.thumbnail} className="w-full h-full object-cover" />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-brand transition-colors">{post.title}</p>
                                <p className="text-[10px] text-slate-400 line-clamp-1 italic">{post.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-sm uppercase">
                              {categories.find(c => c.id === post.categoryId)?.name || 'Mặc định'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                            {post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), 'dd/MM/yyyy') : '---'}
                          </td>
                          <td className="px-6 py-4">
                            {post.status === 'published' ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Đã đăng
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                Bản nháp
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEditor(post)} className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all"><Edit3 size={16} /></button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-20 text-slate-400 text-sm italic">Không có bài viết nào được tìm thấy.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between border-b pb-4">
                  {editingCat?.id ? 'CHỈNH SỬA DANH MỤC' : 'THÊM DANH MỤC MỚI'}
                  {editingCat?.id && <button onClick={() => setEditingCat(null)} className="text-brand text-[10px] font-bold uppercase">Hủy bỏ</button>}
                </h3>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tên danh mục</label>
                    <input type="text" value={editingCat?.name || ''} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" placeholder="VD: Thủ thuật Windows" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Đường dẫn tĩnh (Slug)</label>
                    <input type="text" value={editingCat?.slug || ''} onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" placeholder="vd: thu-thuat-windows" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Thứ tự hiển thị</label>
                    <input type="number" value={editingCat?.order || 0} onChange={(e) => setEditingCat({ ...editingCat, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" />
                  </div>
                  <button disabled={saving} className="w-full blogspot-btn rounded-lg flex items-center justify-center gap-2 py-3 font-bold uppercase tracking-wider text-xs">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'LƯU DANH MỤC'}
                  </button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 font-bold text-slate-800 uppercase text-xs tracking-tighter">Danh sách chủ đề</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Tiêu đề / Slug</th>
                        <th className="px-6 py-4 text-center">Thứ tự</th>
                        <th className="px-6 py-4 text-right">Lựa chọn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categories.map(cat => (
                        <tr key={cat.id} className="hover:bg-slate-50 group">
                          <td className="px-6 py-4">
                            <p onClick={() => setEditingCat(cat)} className="font-bold text-slate-800 text-sm cursor-pointer group-hover:text-brand transition-colors">{cat.name}</p>
                            <p className="text-[10px] text-slate-400 italic">/{cat.slug}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs">{cat.order}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                               <button onClick={() => setEditingCat(cat)} className="p-2 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg"><Edit3 size={16} /></button>
                               <button onClick={() => { if(window.confirm('Xóa danh mục này?')) BlogService.deleteCategory(cat.id).then(loadAllData) }} className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'ads' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
                <h3 className="font-bold text-slate-800 mb-6 border-b pb-4">QUẢN LÝ QUẢNG CÁO</h3>
                <form onSubmit={handleSaveAd} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tên chiến dịch</label>
                    <input value={editingAd?.title || ''} onChange={e => setEditingAd({...editingAd, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" placeholder="VD: Banner khuyến mãi" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hình ảnh (URL)</label>
                    <input value={editingAd?.imageUrl || ''} onChange={e => setEditingAd({...editingAd, imageUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Liên kết đích</label>
                    <input value={editingAd?.link || ''} onChange={e => setEditingAd({...editingAd, link: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vị trí hiển thị</label>
                    <select value={editingAd?.position || 'sidebar'} onChange={e => setEditingAd({...editingAd, position: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-brand">
                      <option value="sidebar">Thanh bên (Sidebar)</option>
                      <option value="header">Cạnh Logo (Header)</option>
                      <option value="post-bottom">Dưới nội dung bài</option>
                    </select>
                  </div>
                  <button className="w-full blogspot-btn rounded-lg py-3 font-bold uppercase text-xs tracking-widest">LƯU THIẾT LẬP</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {ads.map(ad => (
                  <div key={ad.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex gap-5 group hover:border-brand/30 transition-all">
                    <div className="w-40 aspect-video bg-slate-100 rounded-lg overflow-hidden shrink-0 border shadow-sm">
                      <img src={ad.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">{ad.title}</h4>
                        <div className="flex gap-2">
                          <span className="text-[9px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded uppercase tracking-tighter border border-brand/10">{ad.position}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border ${ad.isActive ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                            {ad.isActive ? 'Đang chạy' : 'Đã dừng'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button onClick={() => setEditingAd(ad)} className="text-[10px] font-bold text-slate-400 hover:text-brand uppercase transition-colors">Chỉnh sửa</button>
                        <button onClick={() => { if(window.confirm('Gỡ bỏ quảng cáo này?')) BlogService.deleteAd(ad.id).then(loadAllData) }} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase transition-colors">Gỡ bỏ</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
                <h3 className="font-bold text-slate-800 mb-6 border-b pb-4">ĐIỀU HƯỚNG MENU</h3>
                <form onSubmit={handleSaveMenu} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tên mục hiển thị</label>
                    <input value={editingMenu?.label || ''} onChange={e => setEditingMenu({...editingMenu, label: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" placeholder="VD: TRANG CHỦ" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Đường dẫn liên kết</label>
                    <input value={editingMenu?.link || ''} onChange={e => setEditingMenu({...editingMenu, link: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" placeholder="VD: /category/thu-thuat" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vị trí sắp xếp</label>
                    <input type="number" value={editingMenu?.order || 0} onChange={e => setEditingMenu({...editingMenu, order: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" />
                  </div>
                  <button className="w-full blogspot-btn rounded-lg py-3 font-bold uppercase text-xs tracking-widest">CẬP NHẬT MENU</button>
                </form>
              </div>
              <div className="lg:col-span-2 space-y-3">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between hover:border-brand/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400 text-xs">{item.order}</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm uppercase tracking-tighter">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic">{item.link}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingMenu(item)} className="p-2 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg"><Edit3 size={16} /></button>
                      <button onClick={() => { if(window.confirm('Xóa mục menu này?')) BlogService.deleteMenuItem(item.id).then(loadAllData) }} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-10">
              <div className="flex items-center gap-3 mb-10 border-b pb-6">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Cấu hình Hệ thống</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Thiết lập thông tin chung cho website</p>
                </div>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Tên Website / Thương hiệu</label>
                    <input value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm" placeholder="VD: PHẠM HOÀI VŨ" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Mô tả giới thiệu (SEO Description)</label>
                    <textarea value={settings.description} onChange={e => setSettings({...settings, description: e.target.value})} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm" placeholder="Mô tả về blog của bạn để tối ưu kết quả tìm kiếm..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Link Logo URL</label>
                      <input value={settings.logo} onChange={e => setSettings({...settings, logo: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Thông tin bản quyền Footer</label>
                      <input value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t mt-4 flex justify-end">
                  <button disabled={saving} className="bg-brand text-white font-bold text-xs uppercase tracking-widest h-12 px-12 rounded-xl hover:bg-brand-hover transition-all flex items-center gap-2 shadow-lg shadow-brand/25 active:scale-95 disabled:grayscale">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'LƯU THAY ĐỔI'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Danh mục</label>
                  <select 
                    value={editingPost?.categoryId || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand outline-none text-sm font-bold"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="flex items-center gap-3 pt-8">
                  <input 
                    type="checkbox"
                    id="featured"
                    checked={editingPost?.isFeatured || false}
                    onChange={e => setEditingPost(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded text-brand focus:ring-brand cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-slate-700 cursor-pointer">Đăng lên mục Nổi bật (Slider)</label>
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
            </form>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSavePost}
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-hover disabled:opacity-50 transition-all shadow-brand/20 active:scale-95"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                Lưu Bài Viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
