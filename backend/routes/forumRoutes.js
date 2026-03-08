const express = require('express');
const router = express.Router();
const { getAllPosts, getPostById, createPost, likePost, addComment, deletePost } = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllPosts);
router.get('/:id', protect, getPostById);
router.post('/', protect, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

module.exports = router;
