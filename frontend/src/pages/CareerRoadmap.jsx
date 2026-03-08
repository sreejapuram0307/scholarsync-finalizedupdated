import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Map, TrendingUp, Target, CheckCircle, Clock, Sparkles, IndianRupee } from 'lucide-react';

const CareerRoadmap = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    currentEducation: user?.educationLevel || '',
    targetCareer: '',
    fieldOfStudy: ''
  });

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const { data } = await axios.get('/api/roadmap');
      setRoadmap(data);
      setShowForm(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setShowForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const { data } = await axios.post('/api/roadmap/generate', formData);
      setRoadmap(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'upcoming': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'active': return <Clock className="w-5 h-5 animate-pulse" />;
      case 'upcoming': return <Target className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 flex items-center justify-center h-screen">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Map className="w-8 h-8 text-blue-600" />
              Career Funding Roadmap
            </h1>
            <p className="text-gray-600">Your personalized scholarship journey from education to career</p>
          </div>

          {showForm ? (
            <div className="card p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Generate Your Roadmap</h2>
                <p className="text-gray-600">Tell us about your goals and we'll create a personalized funding plan</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Education Level</label>
                  <select
                    className="input-field"
                    value={formData.currentEducation}
                    onChange={(e) => setFormData({ ...formData, currentEducation: e.target.value })}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Class 9-10">Class 9-10</option>
                    <option value="Class 11-12">Class 11-12</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Career</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Software Engineer, Doctor, Researcher"
                    value={formData.targetCareer}
                    onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Field of Study</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Computer Science, Medicine, Engineering"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full" disabled={generating}>
                  {generating ? 'Generating Your Roadmap...' : 'Generate Roadmap'}
                </button>
              </form>
            </div>
          ) : roadmap ? (
            <div>
              {/* Summary Card */}
              <div className="card p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Level</p>
                    <p className="text-xl font-bold text-gray-900">{roadmap.currentEducation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Target Career</p>
                    <p className="text-xl font-bold text-gray-900">{roadmap.targetCareer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Estimated Funding</p>
                    <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                      <IndianRupee className="w-6 h-6" />
                      {roadmap.totalEstimatedFunding.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-secondary mt-4"
                >
                  Regenerate Roadmap
                </button>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {roadmap.milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {index < roadmap.milestones.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-300 -z-10"></div>
                    )}

                    <div className="card p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        {/* Year Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(milestone.status)}`}>
                          {getStatusIcon(milestone.status)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{milestone.year}</h3>
                              <p className="text-gray-600">{milestone.stage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Estimated Funding</p>
                              <p className="text-lg font-bold text-blue-600">
                                ₹{milestone.estimatedAmount.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </span>
                          </div>

                          {/* Description */}
                          {milestone.description && (
                            <p className="text-gray-600 mb-4 italic">{milestone.description}</p>
                          )}

                          {/* Career Options */}
                          {milestone.careerOptions && milestone.careerOptions.length > 0 && (
                            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Career Guidance
                              </h4>
                              <ul className="space-y-1">
                                {milestone.careerOptions.map((option, idx) => (
                                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>{option}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Scholarships */}
                          {milestone.scholarships && milestone.scholarships.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Recommended Scholarships ({milestone.scholarships.length})
                              </p>
                              <div className="space-y-2">
                                {milestone.scholarships.map((scholarship) => (
                                  <div
                                    key={scholarship._id}
                                    onClick={() => navigate(`/scholarship/${scholarship._id}`)}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                          {scholarship.name}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                          Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-IN')}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-blue-600">
                                          ₹{scholarship.scholarshipAmount.toLocaleString('en-IN')}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Tips */}
              <div className="card p-6 mt-8 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Pro Tips for Success
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Apply to multiple scholarships at each stage to maximize funding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Start preparing documents early for upcoming milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Keep track of deadlines and set reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Maintain good academic performance to stay eligible</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmap;
