import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post, Category, Ad, MenuItem, SiteSettings } from '../types';

const POSTS_COL = 'posts';
const CATS_COL = 'categories';
const ADS_COL = 'ads';
const MENU_COL = 'menuItems';
const SETTINGS_COL = 'settings';

export const BlogService = {
  // Posts
  async getPosts(publishedOnly = true) {
    let q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'));
    if (publishedOnly) {
      q = query(q, where('status', '==', 'published'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  async getFeaturedPosts(count = 5) {
    const q = query(
      collection(db, POSTS_COL), 
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  async getPostBySlug(slug: string) {
    const q = query(collection(db, POSTS_COL), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const postDoc = snapshot.docs[0];
    return { id: postDoc.id, ...postDoc.data() } as Post;
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views'>) {
    return addDoc(collection(db, POSTS_COL), {
      ...post,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updatePost(id: string, updates: Partial<Post>) {
    const postRef = doc(db, POSTS_COL, id);
    return updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePost(id: string) {
    return deleteDoc(doc(db, POSTS_COL, id));
  },

  async incrementViews(id: string) {
    const postRef = doc(db, POSTS_COL, id);
    return updateDoc(postRef, {
      views: increment(1)
    });
  },

  // Categories
  async getCategories() {
    const q = query(collection(db, CATS_COL), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  },

  // Ads
  async getAds(position?: Ad['position']) {
    let q = query(collection(db, ADS_COL), where('isActive', '==', true));
    if (position) {
      q = query(q, where('position', '==', position));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
  },

  // Menu
  async getMenuItems() {
    const q = query(collection(db, MENU_COL), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  // Settings
  async getSettings() {
    const docRef = doc(db, SETTINGS_COL, 'site');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return {
      siteName: 'Trực Blog',
      description: 'Thủ thuật blogspot, game, phim...',
      logo: '',
      footerText: '© 2026 Trực Blog'
    };
  }
};
