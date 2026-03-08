const ScholarshipRoadmap = require('../models/ScholarshipRoadmap');
const Scholarship = require('../models/Scholarship');
const User = require('../models/User');

const checkEligibility = (user, scholarship) => {
  if (user.annualIncome > scholarship.maxIncome) return false;
  
  const scholarshipCategories = scholarship.category.toLowerCase().split('/').map(c => c.trim());
  const userCategory = user.category.toLowerCase();
  const categoryMatch = scholarshipCategories.includes('all') ||
                       scholarshipCategories.some(cat => userCategory.includes(cat)) ||
                       userCategory === 'general';
  
  if (!categoryMatch) return false;
  
  return true;
};

const getCareerOptions = (stage, fieldOfStudy, targetCareer) => {
  const options = [];
  
  if (stage.includes('Class 11-12')) {
    options.push('Choose your stream: Science, Commerce, or Arts');
    options.push('Prepare for entrance exams (JEE, NEET, CLAT, etc.)');
    options.push('Focus on Class 12 board exams');
  } else if (stage.includes('Diploma')) {
    options.push('Complete your diploma with good grades');
    options.push('Option 1: Join BTech through lateral entry');
    options.push('Option 2: Start working in your field');
    options.push('Option 3: Pursue advanced diploma');
  } else if (stage.includes('Undergraduate') || stage.includes('BTech')) {
    options.push('After BTech/Graduation, you can:');
    options.push('→ Pursue MTech/MS for specialization');
    options.push('→ Do MBA for management roles');
    options.push('→ Start working in industry');
    options.push('→ Prepare for government exams (UPSC, SSC, etc.)');
    options.push('→ Start your own startup/business');
  } else if (stage.includes('Postgraduate') || stage.includes('MTech') || stage.includes('MBA')) {
    options.push('After MTech/MBA/PG, you can:');
    options.push('→ Pursue PhD for research and teaching');
    options.push('→ Join top companies with higher positions');
    options.push('→ Work abroad with better opportunities');
    options.push('→ Become consultant in your field');
    options.push('→ Start your own venture');
  } else if (stage.includes('PhD')) {
    options.push('After PhD, you can:');
    options.push('→ Become Professor/Researcher in universities');
    options.push('→ Join R&D departments in companies');
    options.push('→ Work in research institutions');
    options.push('→ Become subject matter expert/consultant');
  }
  
  return options;
};

const generateRoadmapMilestones = async (user, currentEducation, targetCareer, fieldOfStudy) => {
  const allScholarships = await Scholarship.find();
  const currentYear = new Date().getFullYear();
  const milestones = [];
  
  // Define education stages based on current level
  const stages = [];
  
  if (currentEducation.toLowerCase().includes('class 9') || currentEducation.toLowerCase().includes('class 10')) {
    stages.push(
      { year: currentYear, stage: 'Class 9-10', eduLevel: 'class 9-10', description: 'Build strong foundation in basics' },
      { year: currentYear + 1, stage: 'Class 11-12', eduLevel: 'class 11-12', description: 'Choose stream and prepare for entrance exams' },
      { year: currentYear + 3, stage: 'Undergraduate (BTech/BSc/BA)', eduLevel: 'undergraduate', description: 'Pursue degree in your chosen field' },
      { year: currentYear + 7, stage: 'Postgraduate (MTech/MBA/MSc)', eduLevel: 'postgraduate', description: 'Specialize or switch to management' }
    );
  } else if (currentEducation.toLowerCase().includes('class 11') || currentEducation.toLowerCase().includes('class 12')) {
    stages.push(
      { year: currentYear, stage: 'Class 11-12', eduLevel: 'class 11-12', description: 'Focus on boards and entrance exams' },
      { year: currentYear + 2, stage: 'Undergraduate (BTech/BSc/BA)', eduLevel: 'undergraduate', description: 'Get degree in your field' },
      { year: currentYear + 6, stage: 'Postgraduate (MTech/MBA/MSc)', eduLevel: 'postgraduate', description: 'Higher studies or job' }
    );
  } else if (currentEducation.toLowerCase().includes('diploma')) {
    stages.push(
      { year: currentYear, stage: 'Diploma', eduLevel: 'diploma', description: 'Complete diploma with good grades' },
      { year: currentYear + 3, stage: 'BTech (Lateral Entry)', eduLevel: 'undergraduate', description: 'Join BTech 2nd year or start working' },
      { year: currentYear + 6, stage: 'MTech/MBA', eduLevel: 'postgraduate', description: 'Specialize further' }
    );
  } else if (currentEducation.toLowerCase().includes('undergraduate')) {
    stages.push(
      { year: currentYear, stage: 'Undergraduate (BTech/BSc)', eduLevel: 'undergraduate', description: 'Complete your degree' },
      { year: currentYear + 2, stage: 'MTech/MBA/MS', eduLevel: 'postgraduate', description: 'Choose: Higher studies or Job' },
      { year: currentYear + 5, stage: 'PhD/Senior Position', eduLevel: 'phd', description: 'Research or leadership roles' }
    );
  } else if (currentEducation.toLowerCase().includes('postgraduate')) {
    stages.push(
      { year: currentYear, stage: 'Postgraduate (MTech/MBA)', eduLevel: 'postgraduate', description: 'Complete your masters' },
      { year: currentYear + 2, stage: 'PhD/Industry Expert', eduLevel: 'phd', description: 'Research or senior roles' },
      { year: currentYear + 5, stage: 'Professor/CXO Level', eduLevel: 'professional', description: 'Teaching or top management' }
    );
  } else {
    stages.push(
      { year: currentYear, stage: 'Current Level', eduLevel: 'undergraduate', description: 'Focus on current studies' },
      { year: currentYear + 2, stage: 'Next Level', eduLevel: 'postgraduate', description: 'Plan your next step' }
    );
  }
  
  // Match scholarships to each stage
  for (const stage of stages) {
    const matchingScholarships = allScholarships.filter(s => {
      const eduLevel = s.educationLevel.toLowerCase();
      const stageLevel = stage.eduLevel.toLowerCase();
      
      // Check if scholarship matches this education level
      const levelMatch = eduLevel.includes(stageLevel) || 
                        eduLevel.includes('all') ||
                        (stageLevel.includes('undergraduate') && eduLevel.includes('ug')) ||
                        (stageLevel.includes('postgraduate') && eduLevel.includes('pg'));
      
      // Check eligibility
      const eligible = checkEligibility(user, s);
      
      return levelMatch && eligible;
    });
    
    const scholarshipIds = matchingScholarships.slice(0, 5).map(s => s._id);
    const estimatedAmount = matchingScholarships.slice(0, 5).reduce((sum, s) => sum + s.scholarshipAmount, 0);
    
    // Determine status
    let status = 'upcoming';
    if (stage.year === currentYear) {
      status = 'active';
    } else if (stage.year < currentYear) {
      status = 'completed';
    }
    
    const careerOptions = getCareerOptions(stage.stage, fieldOfStudy, targetCareer);
    
    milestones.push({
      year: stage.year,
      stage: stage.stage,
      description: stage.description,
      careerOptions,
      scholarships: scholarshipIds,
      estimatedAmount,
      status
    });
  }
  
  return milestones;
};

exports.generateRoadmap = async (req, res) => {
  try {
    const { currentEducation, targetCareer, fieldOfStudy } = req.body;
    const user = await User.findById(req.user._id);
    
    // Delete existing roadmap
    await ScholarshipRoadmap.deleteOne({ userId: user._id });
    
    // Generate milestones
    const milestones = await generateRoadmapMilestones(user, currentEducation, targetCareer, fieldOfStudy);
    
    // Calculate total funding
    const totalEstimatedFunding = milestones.reduce((sum, m) => sum + m.estimatedAmount, 0);
    
    // Create roadmap
    const roadmap = await ScholarshipRoadmap.create({
      userId: user._id,
      currentEducation,
      targetCareer,
      fieldOfStudy,
      milestones,
      totalEstimatedFunding
    });
    
    const populatedRoadmap = await ScholarshipRoadmap.findById(roadmap._id)
      .populate('milestones.scholarships');
    
    res.json(populatedRoadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await ScholarshipRoadmap.findOne({ userId: req.user._id })
      .populate('milestones.scholarships');
    
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found. Please generate one first.' });
    }
    
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMilestoneStatus = async (req, res) => {
  try {
    const { year } = req.params;
    const { status } = req.body;
    
    const roadmap = await ScholarshipRoadmap.findOne({ userId: req.user._id });
    
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    
    const milestone = roadmap.milestones.find(m => m.year === parseInt(year));
    if (milestone) {
      milestone.status = status;
      await roadmap.save();
    }
    
    const updatedRoadmap = await ScholarshipRoadmap.findById(roadmap._id)
      .populate('milestones.scholarships');
    
    res.json(updatedRoadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
