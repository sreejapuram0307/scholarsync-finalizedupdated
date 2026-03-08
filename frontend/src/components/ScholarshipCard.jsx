import { useNavigate } from 'react-router-dom';
import { Calendar, IndianRupee, Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const ScholarshipCard = ({ scholarship, isBookmarked, onBookmarkChange }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (bookmarked) {
        await axios.delete(`/api/bookmark/${scholarship._id}`);
        setBookmarked(false);
      } else {
        await axios.post(`/api/bookmark/${scholarship._id}`);
        setBookmarked(true);
      }
      if (onBookmarkChange) onBookmarkChange();
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <div
      onClick={() => navigate(`/scholarship/${scholarship._id}`)}
      className="card p-6 cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
          {scholarship.name}
        </h3>
        <button
          onClick={handleBookmark}
          disabled={loading}
          className="text-gray-400 hover:text-blue-600 transition-colors"
        >
          {bookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600 fill-blue-600" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IndianRupee className="w-4 h-4" />
          <span className="font-medium">₹{formatAmount(scholarship.scholarshipAmount)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Deadline: {formatDate(scholarship.deadline)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
          {scholarship.category}
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
          {scholarship.educationLevel}
        </span>
      </div>
    </div>
  );
};

export default ScholarshipCard;
