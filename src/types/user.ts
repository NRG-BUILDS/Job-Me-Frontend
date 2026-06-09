export type User = {
  _id: string;
  email: string;
  username: string | null;
  is_artisan: boolean;
  first_name: string;
  last_name: string;
};
export interface UserProfile {
  id: number;
  phone_number?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  profile_picture?: string | null;
}
