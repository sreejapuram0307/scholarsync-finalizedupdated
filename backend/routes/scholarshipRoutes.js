const express = require('express');
const router = express.Router();
const { getAllScholarships, getEligibleScholarships, getClosingSoon, getHighAmount, getScholarshipById } = require('../controllers/scholarshipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllScholarships);
router.get('/eligible', protect, getEligibleScholarships);
router.get('/closing-soon', protect, getClosingSoon);
router.get('/high-amount', protect, getHighAmount);
router.get('/:id', protect, getScholarshipById);

module.exports = router;
