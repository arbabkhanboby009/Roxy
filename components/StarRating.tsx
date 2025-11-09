import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 'md' }) => {
  const starSize = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size];

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        const isHalfFilled = !isFilled && (star - 0.5) <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(star)}
            disabled={!onRatingChange}
            className={`text-yellow-400 ${onRatingChange ? 'cursor-pointer' : ''} ${starSize}`}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className="w-full h-full"
              fill={isFilled || isHalfFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
