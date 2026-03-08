const Scholarship = require('../models/Scholarship');

const checkEligibility = (user, scholarship) => {
  // Income check
  if (user.annualIncome > scholarship.maxIncome) return false;

  // Category check
  const scholarshipCategories = scholarship.category.toLowerCase().split('/').map(c => c.trim());
  const userCategory = user.category.toLowerCase();

  const categoryMatch = scholarshipCategories.includes('all') ||
                       scholarshipCategories.some(cat => userCategory.includes(cat)) ||
                       userCategory === 'general';

  if (!categoryMatch) return false;

  // Education level check
  const scholarshipEdu = scholarship.educationLevel.toLowerCase();
  const userEdu = user.educationLevel.toLowerCase();

  if (scholarshipEdu.includes('all') || scholarshipEdu.includes(userEdu)) {
    return true;
  }

  return false;
};

exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ deadline: 1 });
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEligibleScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    const eligible = scholarships.filter(s => checkEligibility(req.user, s));
    res.json(eligible);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClosingSoon = async (req, res) => {
  try {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const scholarships = await Scholarship.find({
      deadline: { $lte: sevenDaysFromNow, $gte: new Date() }
    }).sort({ deadline: 1 });

    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHighAmount = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      scholarshipAmount: { $gte: 50000 }
    }).sort({ scholarshipAmount: -1 });

    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
