const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, updateMilestoneStatus } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getRoadmap);
router.put('/milestone/:year', protect, updateMilestoneStatus);

module.exports = router;
