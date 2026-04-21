export interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  categoryId: string;
  authorId: string;
  createdAt: any;
  updatedAt: any;
  views: number;
  isFeatured: boolean;
  status: 'draft' | 'published';
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  order: number;
}

export interface Ad {
  id?: string;
  title: string;
  imageUrl: string;
  link: string;
  position: 'sidebar' | 'top' | 'bottom' | 'popup';
  isActive: boolean;
  createdAt: any;
}

export interface MenuItem {
  id?: string;
  label: string;
  link: string;
  order: number;
  parentId?: string;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  logo: string;
  footerText: string;
}
