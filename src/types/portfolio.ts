export interface Partner {
  id: string;
  name: string;
  socialName: string;
  socialLink: string;
  imageUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  client?: string;
  category: "Branding" | "Logo" | "Poster" | "Other";
  tagline: string;
  media_url: string;
  media_type: string;
  full_image_url?: string;
  year?: string;
  order_index: number;
  is_multiple_partners: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  partners?: Partner[];
}