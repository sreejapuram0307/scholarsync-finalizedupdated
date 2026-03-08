const User = require('../models/User');
const Scholarship = require('../models/Scholarship');

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const scholarshipId = req.params.id;

    if (user.bookmarks.includes(scholarshipId)) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    user.bookmarks.push(scholarshipId);
    await user.save();

    res.json({ message: 'Bookmark added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const scholarshipId = req.params.id;

    user.bookmarks = user.bookmarks.filter(id => id.toString() !== scholarshipId);
    await user.save();

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
