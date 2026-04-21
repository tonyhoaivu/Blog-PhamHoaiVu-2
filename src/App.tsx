import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Github, Facebook, MessageSquare, Newspaper, Settings as SettingsIcon } from 'lucide-react';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';
import { BlogService } from './services/blogService';
import { MenuItem, SiteSettings } from './types';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    BlogService.getMenuItems().then(setMenuItems);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass-card !rounded-none border-x-0 border-t-0 py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-brand/30 group-hover:scale-110 transition-transform">
            T
          </div>
          <span className="text-xl font-display font-bold tracking-tight">
            Trực <span className="text-brand">Blog</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.link}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand transition-colors ${
                location.pathname === item.link ? 'text-brand' : 'text-slate-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/admin" className="p-2 text-slate-400 hover:text-brand transition-colors">
            <SettingsIcon size={20} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-slate-900">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {menuItems.map((item) => (
                <Link 
                  key={item.id} 
                  to={item.link} 
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-slate-700 hover:text-brand"
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 font-bold text-slate-700 hover:text-brand"
              >
                Cài đặt hệ thống
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-3xl font-display font-bold">Trực <span className="text-brand">Blog</span></h2>
          <p className="text-slate-400 max-w-sm leading-relaxed">
            Nơi chia sẻ những thủ thuật blogspot, game, phim và kiến thức bổ ích cho cộng đồng Blogger Việt. 
            Cùng nhau học hỏi và phát triển.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-brand transition-colors"><Facebook size={20} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-brand transition-colors"><MessageSquare size={20} /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-brand transition-colors"><Github size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-brand">Liên kết nhanh</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
            <li><Link to="/c/blogpost" className="hover:text-white transition-colors">Thủ thuật blogspot</Link></li>
            <li><Link to="/c/trao-doi-lien-ket" className="hover:text-white transition-colors">Trao đổi liên kết</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Quản trị viên</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-brand">Bản tin</h4>
          <p className="text-xs text-slate-500 mb-4">Nhận thông tin mới nhất từ chúng tôi qua email.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="bg-white/5 border-none rounded-lg px-4 py-2 text-sm flex-grow outline-none focus:ring-1 focus:ring-brand"
            />
            <button className="bg-brand px-4 py-2 rounded-lg font-bold hover:bg-brand-hover transition-colors">Gửi</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
        <p>© 2026 TRỰC BLOG. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Home />
                </motion.div>
              } />
              <Route path="/p/:slug" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PostDetail />
                </motion.div>
              } />
              <Route path="/admin" element={
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                  <Admin />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
