import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: '',
    state: '', category: '', annualIncome: '', educationLevel: '',
    instituteName: '', gpa10: '', gpa12: '', guardianOccupation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/signup', formData);
      login(data, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-6 py-12">
      <div className="card p-8 w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold">ScholarSync</span>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-600 mb-8">Step {step} of 2</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" className="input-field" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="input-field" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input type="password" className="input-field" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input type="number" className="input-field" value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select className="input-field" value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="button" onClick={() => setStep(2)} className="btn-primary w-full flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input type="text" className="input-field" value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="input-field" value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                    <option value="EWS">EWS</option>
                    <option value="Minority">Minority</option>
                    <option value="PWD">PWD</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Income (₹)</label>
                  <input type="number" className="input-field" value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Education Level</label>
                  <select className="input-field" value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })} required>
                    <option value="">Select Level</option>
                    <option value="Class 9-10">Class 9-10</option>
                    <option value="Class 11-12">Class 11-12</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Institute Name</label>
                <input type="text" className="input-field" value={formData.instituteName}
                  onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })} required />
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
