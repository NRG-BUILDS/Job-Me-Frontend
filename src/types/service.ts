type Service = {
  _id: string;
  artisan: string;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export { Service };
