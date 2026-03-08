import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import ScholarshipChat from './pages/ScholarshipChat';
import CareerRoadmap from './pages/CareerRoadmap';
import CommunityForum from './pages/CommunityForum';
import ForumPostDetail from './pages/ForumPostDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/chat" element={<ScholarshipChat />} />
          <Route path="/roadmap" element={<CareerRoadmap />} />
          <Route path="/forum" element={<CommunityForum />} />
          <Route path="/forum/:id" element={<ForumPostDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
