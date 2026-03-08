const express = require('express');
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getBookmarks);
router.post('/:id', protect, addBookmark);
router.delete('/:id', protect, removeBookmark);

module.exports = router;
