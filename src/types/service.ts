import { UserProfile } from "./user";

type ArtisanProfile = {
  profile_picture?: string;
  location?: { state: string; town: string };
  phone_number?: string;
};

type User = {
  _id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  online_status: "offline" | "online";
  profile?: ArtisanProfile;
};

type Service = {
  _id: string;
  artisan: User;
  title: string;
  category: {
    _id: string;
    name: string;
    icon: string;
  };
  category_slug: string;
  subcategory: string;
  search_tags: string[];
  description: string;
  offerings: {
    title: string;
    price: number;
    _id: string;
  }[];
  faq: {
    question: string;
    answer: string;
    _id: string;
  }[];
  gallery: {
    url: string;
    media_type: string;
    _id: string;
  }[];
  verification_docs: {
    nin_slip: string | null;
    proof_of_membership: string | null;
    utility_bill: string | null;
    contact_email: string | null;
    _id: string;
  };
  status: "draft" | "published" | string;
  rating_average: number;
  reviews_count: number;
  orders_count: number;
  starting_price: number;
  isPromoted?: boolean;
  promotionPlan?: "3days" | "1week" | "1month" | null;
  promotionExpiresAt?: string;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ServiceDetails = {
  _id: string;
  artisan: {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    is_verified: boolean;
    google_id: string | null;
    is_artisan: boolean;
    is_active: boolean;
    online_status: "online" | "offline" | string;
    deactivation_reason: string | null;
    is_deactivated: boolean;
    referral_code: string | null;
    referred_by: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    profile?: UserProfile;
  };
  title: string;
  category: {
    name: string;
    slug: string;
    icon: string;
    subcategories: {
      name: string;
      slug: string;
    }[];
  };
  category_slug: string;
  subcategory: string;
  search_tags: string[];
  description: string;
  offerings: {
    title: string;
    price: number;
    _id: string;
  }[];
  faq: {
    question: string;
    answer: string;
    _id: string;
  }[];
  gallery: {
    url: string;
    media_type: "image" | "video" | string;
    _id: string;
  }[];
  status: "draft" | "published" | string;
  rating_average: number;
  reviews_count: number;
  orders_count: number;
  starting_price: number;
  isPromoted?: boolean;
  promotionPlan?: "3days" | "1week" | "1month" | null;
  promotionExpiresAt?: string;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type { Service, ServiceDetails };
