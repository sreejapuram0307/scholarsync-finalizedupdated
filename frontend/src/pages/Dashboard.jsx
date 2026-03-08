import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ScholarshipCard from '../components/ScholarshipCard';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchScholarships();
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    filterScholarships();
  }, [activeFilter, scholarships, searchQuery]);

  const fetchScholarships = async () => {
    try {
      const { data } = await axios.get('/api/scholarships');
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get('/api/bookmark');
      setBookmarkedIds(data.map(s => s._id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const filterScholarships = async () => {
    setLoading(true);
    try {
      let filtered = [];
      
      if (activeFilter === 'all') {
        const { data } = await axios.get('/api/scholarships');
        filtered = data;
      } else if (activeFilter === 'eligible') {
        const { data } = await axios.get('/api/scholarships/eligible');
        filtered = data;
      } else if (activeFilter === 'closing-soon') {
        const { data } = await axios.get('/api/scholarships/closing-soon');
        filtered = data;
      } else if (activeFilter === 'high-amount') {
        const { data } = await axios.get('/api/scholarships/high-amount');
        filtered = data;
      }

      if (searchQuery) {
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredScholarships(filtered);
    } catch (error) {
      console.error('Error filtering scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">Discover scholarships tailored for you</p>
          </div>

          <div className="mb-6 flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Scholarships' },
              { id: 'eligible', label: 'Eligible for You' },
              { id: 'closing-soon', label: 'Closing Soon' },
              { id: 'high-amount', label: 'High Amount' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading scholarships...</p>
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No scholarships found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship._id}
                  scholarship={scholarship}
                  isBookmarked={bookmarkedIds.includes(scholarship._id)}
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

export default Dashboard;
