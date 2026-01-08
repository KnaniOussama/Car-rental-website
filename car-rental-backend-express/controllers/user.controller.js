const User = require('../models/user.model');

// @desc    Get all users for admin panel
// @route   GET /api/users/admin
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users but exclude the password field
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update a user's admin status
// @route   PUT /api/users/admin/:id
// @access  Private (Admin)
exports.updateUserAdminStatus = async (req, res) => {
  try {
    const { isAdmin } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from revoking their own admin status accidentally
    // A more robust system might check the number of admins before allowing this
    if (req.user.id === user.id && !isAdmin) {
        return res.status(400).json({ message: 'Admins cannot revoke their own admin status.' });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ message: 'User admin status updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
