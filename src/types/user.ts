export type User = {
  email: string;
  username: string | null;
  is_artisan: boolean;
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
