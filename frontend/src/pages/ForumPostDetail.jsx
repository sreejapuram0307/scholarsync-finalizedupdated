import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { ArrowLeft, ThumbsUp, MessageCircle, Eye, Send } from 'lucide-react';

const ForumPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/api/forum/${id}`);
      setPost(data);
      setIsLiked(data.likes?.includes(user._id));
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`/api/forum/${id}/like`);
      setIsLiked(data.isLiked);
      fetchPost();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(`/api/forum/${id}/comment`, { content: comment });
      setComment('');
      fetchPost();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Question': 'bg-blue-100 text-blue-700',
      'Experience': 'bg-purple-100 text-purple-700',
      'Tips': 'bg-green-100 text-green-700',
      'Success Story': 'bg-yellow-100 text-yellow-700',
      'General': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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

  if (!post) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 flex items-center justify-center h-screen">
          <p className="text-gray-600">Post not found</p>
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
            onClick={() => navigate('/forum')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </button>

          {/* Post Card */}
          <div className="card p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <Eye className="w-4 h-4" />
                {post.views} views
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {post.userId?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.userId?.name}</p>
                  <p className="text-xs text-gray-500">
                    {post.userId?.educationLevel} • {post.userId?.instituteName}
                  </p>
                </div>
              </div>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-6 border-t">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isLiked
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-blue-600' : ''}`} />
                <span className="font-medium">{post.likes?.length || 0}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6">Comments ({post.comments?.length || 0})</h2>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="btn-primary px-4">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">
                        {comment.userId?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.userId?.name}</span>
                          <span className="text-xs text-gray-500">
                            {comment.userId?.educationLevel}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail;
