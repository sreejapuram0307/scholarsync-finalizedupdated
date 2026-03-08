import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { MessageCircle, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';

const ScholarshipChat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What scholarships am I eligible for?",
    "Show me closing soon scholarships",
    "What documents do I need?",
    "Show me high amount scholarships"
  ];

  useEffect(() => {
    if (user) {
      // Add welcome message
      setMessages([{
        type: 'bot',
        text: `Hello ${user.name}! 👋\n\nI'm your ScholarSync AI assistant. I can help you find scholarships, check deadlines, and answer your questions.\n\nTry asking me something!`,
        timestamp: new Date()
      }]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chat', { message: messageText });
      
      const botMessage = {
        type: 'bot',
        text: data.response,
        scholarships: data.scholarships,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSend(question);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              Scholarship AI Assistant
            </h1>
            <p className="text-gray-600">Ask me anything about scholarships!</p>
          </div>

          <div className="card p-6 h-[600px] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                    }`}>
                      {msg.type === 'user' ? (
                        <UserIcon className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <div className={`rounded-2xl p-4 ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      
                      {msg.scholarships && msg.scholarships.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.scholarships.map((scholarship) => (
                            <div
                              key={scholarship._id}
                              onClick={() => navigate(`/scholarship/${scholarship._id}`)}
                              className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-all"
                            >
                              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                {scholarship.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                ₹{scholarship.scholarshipAmount.toLocaleString('en-IN')} • 
                                Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-sm px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about scholarships..."
                className="input-field flex-1"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="btn-primary px-4"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipChat;
