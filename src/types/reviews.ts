import { User } from "./user";

type ReviewType = {
  rating: number;
  review: string;
  service: string;
  reviewer: User;
  order: string;
  created_at: string;
  updated_at: string;
};

export default ReviewType;
