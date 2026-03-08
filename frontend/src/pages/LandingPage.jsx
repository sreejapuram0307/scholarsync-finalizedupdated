import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, BookmarkCheck, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ScholarSync</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="btn-secondary">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-blue-600">Scholarship</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered scholarship matching platform that helps students discover personalized funding opportunities
          </p>
          <button onClick={() => navigate('/signup')} className="btn-primary text-lg px-8 py-3">
            Start Your Journey
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card p-8 text-center">
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">AI-powered eligibility filtering based on your profile</p>
          </div>
          <div className="card p-8 text-center">
            <BookmarkCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save & Track</h3>
            <p className="text-gray-600">Bookmark scholarships and track deadlines easily</p>
          </div>
          <div className="card p-8 text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">High Success Rate</h3>
            <p className="text-gray-600">Get matched with scholarships you're most likely to win</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
