import { Star } from "lucide-react";

// Star component for ratings
const StarRating = ({ rating, showRating = false, size = "w-4 h-4" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? "fill-yellow-400 text-[#FFB33E]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      {showRating ? (
        <span className="font-semibold text-[#FFB33E]">{rating}</span>
      ) : null}
    </div>
  );
};

export default StarRating;
