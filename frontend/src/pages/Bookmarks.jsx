import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ScholarshipCard from '../components/ScholarshipCard';
import axios from 'axios';
import { BookmarkCheck } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get('/api/bookmark');
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BookmarkCheck className="w-8 h-8 text-blue-600" />
              Saved Scholarships
            </h1>
            <p className="text-gray-600">Your bookmarked scholarships</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No bookmarks yet</p>
              <p className="text-gray-500 mt-2">Start bookmarking scholarships to see them here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship._id}
                  scholarship={scholarship}
                  isBookmarked={true}
                  onBookmarkChange={fetchBookmarks}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
