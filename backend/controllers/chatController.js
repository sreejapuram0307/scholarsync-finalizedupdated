const ChatMessage = require('../models/ChatMessage');
const Scholarship = require('../models/Scholarship');
const User = require('../models/User');

const generateChatResponse = async (user, message) => {
  const lowerMessage = message.toLowerCase();
  
  // Get all scholarships
  const allScholarships = await Scholarship.find();
  
  // Check eligibility for user
  const checkEligibility = (scholarship) => {
    if (user.annualIncome > scholarship.maxIncome) return false;
    
    const scholarshipCategories = scholarship.category.toLowerCase().split('/').map(c => c.trim());
    const userCategory = user.category.toLowerCase();
    const categoryMatch = scholarshipCategories.includes('all') ||
                         scholarshipCategories.some(cat => userCategory.includes(cat)) ||
                         userCategory === 'general';
    
    if (!categoryMatch) return false;
    
    const scholarshipEdu = scholarship.educationLevel.toLowerCase();
    const userEdu = user.educationLevel.toLowerCase();
    
    return scholarshipEdu.includes('all') || scholarshipEdu.includes(userEdu);
  };
  
  const eligibleScholarships = allScholarships.filter(checkEligibility);
  
  // Closing soon scholarships
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const closingSoon = eligibleScholarships.filter(s => 
    new Date(s.deadline) <= sevenDaysFromNow && new Date(s.deadline) >= new Date()
  );
  
  // High amount scholarships
  const highAmount = eligibleScholarships.filter(s => s.scholarshipAmount >= 50000);
  
  let response = '';
  let recommendedScholarships = [];
  
  // Pattern matching for different queries
  if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('can i apply')) {
    response = `Based on your profile (${user.category}, ${user.educationLevel}, Income: ₹${user.annualIncome.toLocaleString('en-IN')}), you are eligible for ${eligibleScholarships.length} scholarships!\n\n`;
    
    if (eligibleScholarships.length > 0) {
      response += 'Here are some top matches:\n';
      const top5 = eligibleScholarships.slice(0, 5);
      top5.forEach((s, i) => {
        response += `\n${i + 1}. ${s.name}\n   Amount: ₹${s.scholarshipAmount.toLocaleString('en-IN')}\n   Deadline: ${new Date(s.deadline).toLocaleDateString('en-IN')}`;
      });
      recommendedScholarships = top5.map(s => s._id);
    }
  }
  else if (lowerMessage.includes('closing soon') || lowerMessage.includes('deadline') || lowerMessage.includes('urgent')) {
    if (closingSoon.length > 0) {
      response = `⚠️ You have ${closingSoon.length} scholarships closing within 7 days!\n\n`;
      closingSoon.forEach((s, i) => {
        const daysLeft = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        response += `\n${i + 1}. ${s.name}\n   ⏰ ${daysLeft} days left!\n   Amount: ₹${s.scholarshipAmount.toLocaleString('en-IN')}`;
      });
      recommendedScholarships = closingSoon.map(s => s._id);
    } else {
      response = 'Good news! You don\'t have any scholarships with urgent deadlines right now. Keep checking regularly!';
    }
  }
  else if (lowerMessage.includes('high amount') || lowerMessage.includes('maximum') || lowerMessage.includes('highest')) {
    if (highAmount.length > 0) {
      response = `💰 Found ${highAmount.length} high-value scholarships (₹50,000+) for you!\n\n`;
      const sorted = highAmount.sort((a, b) => b.scholarshipAmount - a.scholarshipAmount).slice(0, 5);
      sorted.forEach((s, i) => {
        response += `\n${i + 1}. ${s.name}\n   Amount: ₹${s.scholarshipAmount.toLocaleString('en-IN')}\n   Deadline: ${new Date(s.deadline).toLocaleDateString('en-IN')}`;
      });
      recommendedScholarships = sorted.map(s => s._id);
    } else {
      response = 'Currently, there are no high-amount scholarships matching your profile. Check back later!';
    }
  }
  else if (lowerMessage.includes('document') || lowerMessage.includes('what do i need')) {
    response = `📄 Common documents required for scholarships:\n\n`;
    response += `• Passport size photograph\n`;
    response += `• Academic transcripts/marksheets\n`;
    response += `• Income certificate\n`;
    response += `• Caste certificate (if applicable)\n`;
    response += `• Aadhaar card\n`;
    response += `• Bank account details\n`;
    response += `• Admission proof/ID card\n\n`;
    response += `Tip: Keep all documents ready in digital format for quick applications!`;
  }
  else if (lowerMessage.includes('how to apply') || lowerMessage.includes('application process')) {
    response = `📝 Scholarship Application Process:\n\n`;
    response += `1. Browse eligible scholarships on your dashboard\n`;
    response += `2. Click on a scholarship to view full details\n`;
    response += `3. Check eligibility criteria carefully\n`;
    response += `4. Prepare all required documents\n`;
    response += `5. Click "Apply Now" to visit the official website\n`;
    response += `6. Fill the application form accurately\n`;
    response += `7. Upload documents and submit\n\n`;
    response += `Pro tip: Apply early and to multiple scholarships to increase your chances!`;
  }
  else if (lowerMessage.includes('diploma') || lowerMessage.includes('cse') || lowerMessage.includes('computer')) {
    const techScholarships = eligibleScholarships.filter(s => 
      s.name.toLowerCase().includes('technical') || 
      s.name.toLowerCase().includes('engineering') ||
      s.educationLevel.toLowerCase().includes('diploma') ||
      s.educationLevel.toLowerCase().includes('ug')
    );
    
    if (techScholarships.length > 0) {
      response = `💻 Found ${techScholarships.length} scholarships for technical/engineering students!\n\n`;
      techScholarships.slice(0, 5).forEach((s, i) => {
        response += `\n${i + 1}. ${s.name}\n   Amount: ₹${s.scholarshipAmount.toLocaleString('en-IN')}\n   For: ${s.educationLevel}`;
      });
      recommendedScholarships = techScholarships.slice(0, 5).map(s => s._id);
    } else {
      response = `I found ${eligibleScholarships.length} scholarships for you based on your profile. Check the "Eligible for You" section!`;
    }
  }
  else if (lowerMessage.includes('income') && lowerMessage.match(/\d+/)) {
    const mentionedIncome = parseInt(lowerMessage.match(/\d+/)[0]);
    const incomeInLakhs = mentionedIncome < 1000 ? mentionedIncome * 100000 : mentionedIncome;
    
    const matchingIncome = allScholarships.filter(s => incomeInLakhs <= s.maxIncome);
    response = `For an income of ₹${incomeInLakhs.toLocaleString('en-IN')}, you can apply to ${matchingIncome.length} scholarships!\n\n`;
    
    if (matchingIncome.length > 0) {
      response += 'Top recommendations:\n';
      matchingIncome.slice(0, 5).forEach((s, i) => {
        response += `\n${i + 1}. ${s.name}\n   Max Income: ₹${s.maxIncome.toLocaleString('en-IN')}\n   Amount: ₹${s.scholarshipAmount.toLocaleString('en-IN')}`;
      });
      recommendedScholarships = matchingIncome.slice(0, 5).map(s => s._id);
    }
  }
  else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    response = `Hello ${user.name}! 👋\n\nI'm your ScholarSync AI assistant. I can help you with:\n\n`;
    response += `• Finding eligible scholarships\n`;
    response += `• Checking urgent deadlines\n`;
    response += `• High-value scholarship recommendations\n`;
    response += `• Document requirements\n`;
    response += `• Application guidance\n\n`;
    response += `You're currently eligible for ${eligibleScholarships.length} scholarships. What would you like to know?`;
  }
  else {
    // Default response with personalized info
    response = `I'm here to help you find scholarships! 🎓\n\n`;
    response += `Quick Stats:\n`;
    response += `• Total eligible scholarships: ${eligibleScholarships.length}\n`;
    response += `• Closing soon: ${closingSoon.length}\n`;
    response += `• High-value (₹50K+): ${highAmount.length}\n\n`;
    response += `Try asking:\n`;
    response += `• "What scholarships am I eligible for?"\n`;
    response += `• "Show me closing soon scholarships"\n`;
    response += `• "What documents do I need?"\n`;
    response += `• "How to apply for scholarships?"`;
  }
  
  return { response, recommendedScholarships };
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user._id);
    
    const { response, recommendedScholarships } = await generateChatResponse(user, message);
    
    const chatMessage = await ChatMessage.create({
      userId: user._id,
      message,
      response,
      scholarshipsRecommended: recommendedScholarships
    });
    
    res.json({
      message: chatMessage.message,
      response: chatMessage.response,
      scholarships: await Scholarship.find({ _id: { $in: recommendedScholarships } })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('scholarshipsRecommended');
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
