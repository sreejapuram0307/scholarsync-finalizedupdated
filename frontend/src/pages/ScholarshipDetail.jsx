import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Calendar, IndianRupee, ExternalLink, ArrowLeft, CheckCircle, FileText } from 'lucide-react';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const { data } = await axios.get(`/api/scholarships/${id}`);
      setScholarship(data);
    } catch (error) {
      console.error('Error fetching scholarship:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
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

  if (!scholarship) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 flex items-center justify-center h-screen">
          <p className="text-gray-600">Scholarship not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{scholarship.name}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scholarship Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{formatAmount(scholarship.scholarshipAmount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application Deadline</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(scholarship.deadline)}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <a
                href={scholarship.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligibility Criteria
                </h2>
                <ul className="space-y-2">
                  {scholarship.eligibilityRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Required Documents
                </h2>
                <ul className="space-y-2">
                  {scholarship.documentsRequired.map((doc, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium">{scholarship.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Education Level</p>
                  <p className="font-medium">{scholarship.educationLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Max Income</p>
                  <p className="font-medium">₹{formatAmount(scholarship.maxIncome)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetail;
