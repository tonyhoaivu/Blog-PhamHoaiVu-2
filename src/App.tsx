import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Search, Moon, Home as HomeIcon, Settings as SettingsIcon, MessageSquare, Link as LinkIcon, Hash } from 'lucide-react';
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
    BlogService.getMenuItems().then(items => {
      setMenuItems(items);
    });
  }, []);

  return (
    <nav className="bg-brand text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-10">
        {/* Mobile menu toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 font-bold text-sm tracking-tighter">
              <span className="bg-white text-brand px-1 rounded-xs">PHẠM</span> HOÀI VŨ
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center">
              <Link to="/" className="p-2 hover:bg-white/10 transition-colors">
                <HomeIcon size={14} className="fill-current" />
              </Link>
              {menuItems.map((item) => (
                <div key={item.id} className="relative group px-3 h-10 flex items-center hover:bg-white/10 cursor-pointer transition-colors text-[10px] font-bold tracking-tight">
                  {item.label}
                  <ChevronDown size={10} className="ml-1 opacity-50" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 transition-colors"><Moon size={14} /></button>
            <button className="p-2 hover:bg-white/10 transition-colors border-l border-white/10 outline-none">
              <Search size={14} strokeWidth={3} />
            </button>
            <Link to="/admin" className="p-2 hover:bg-white/10 transition-colors"><SettingsIcon size={14} /></Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-slate-800"
          >
            {menuItems.map(item => (
              <Link 
                key={item.id} 
                to={item.link} 
                className="block px-6 py-3 border-b border-white/5 text-[11px] font-bold"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer-gradient pt-16 pb-8 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1 */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2">Nhận xét mới</h4>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px]">
                  <p className="font-bold text-slate-800">Blogger {i}</p>
                  <p className="text-slate-500 line-clamp-1 italic">"Cảm ơn bài viết rất hữu ích..."</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2">Liên kết</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-medium text-slate-500">
            {['Hung Pro VN', 'Anh Trai Nàng Blogger', 'Blogspot Việt Nam', 'Thủ thuật blogspot', 'Ngày hôm qua', 'Duy Pham'].map(link => (
              <a key={link} href="#" className="flex items-center gap-1.5 hover:text-brand transition-colors"><LinkIcon size={10} /> {link}</a>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2"># Chủ đề hay</h4>
          <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
            {['Hình Nền', 'Blogspot', 'CSS', 'Windows', 'Comments', 'Bạn Có Biết', 'Javascript', 'Phim Công Giáo'].map(tag => (
              <span key={tag} className="px-2 py-1 bg-white border border-slate-200 hover:text-brand cursor-pointer transition-colors uppercase">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mascot Goku */}
      <div className="absolute right-4 bottom-4 w-40 pointer-events-none">
        <img 
          src="https://raw.githubusercontent.com/AncPlay/images/main/goku-nimbus.png" 
          alt="Goku" 
          className="w-full h-auto drop-shadow-xl animate-bounce" 
          style={{ animationDuration: '3s' }}
        />
      </div>

      <div className="text-center mt-12 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase">
        Copyright © 2026 - PHẠM HOÀI VŨ • Thiết kế bởi AncPlay
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
