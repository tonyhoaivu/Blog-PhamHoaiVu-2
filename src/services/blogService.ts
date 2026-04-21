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

  async createCategory(cat: Omit<Category, 'id'>) {
    return addDoc(collection(db, CATS_COL), cat);
  },

  async updateCategory(id: string, updates: Partial<Category>) {
    return updateDoc(doc(db, CATS_COL, id), updates);
  },

  async deleteCategory(id: string) {
    return deleteDoc(doc(db, CATS_COL, id));
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

  async getAllAds() {
    const q = query(collection(db, ADS_COL), orderBy('title', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
  },

  async createAd(ad: Omit<Ad, 'id' | 'createdAt'>) {
    return addDoc(collection(db, ADS_COL), {
      ...ad,
      createdAt: serverTimestamp()
    });
  },

  async updateAd(id: string, updates: Partial<Ad>) {
    return updateDoc(doc(db, ADS_COL, id), updates);
  },

  async deleteAd(id: string) {
    return deleteDoc(doc(db, ADS_COL, id));
  },

  // Menu
  async getMenuItems() {
    const q = query(collection(db, MENU_COL), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  },

  async createMenuItem(item: Omit<MenuItem, 'id'>) {
    return addDoc(collection(db, MENU_COL), item);
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    return updateDoc(doc(db, MENU_COL, id), updates);
  },

  async deleteMenuItem(id: string) {
    return deleteDoc(doc(db, MENU_COL, id));
  },

  // Settings
  async getSettings() {
    const docRef = doc(db, SETTINGS_COL, 'site');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return {
      siteName: 'Phạm Hoài Vũ',
      description: 'Chia sẻ kiến thức & thủ thuật',
      logo: '',
      footerText: '© 2026 Phạm Hoài Vũ'
    };
  },

  async updateSettings(updates: SiteSettings) {
    return updateDoc(doc(db, SETTINGS_COL, 'site'), updates as any);
  }
};
