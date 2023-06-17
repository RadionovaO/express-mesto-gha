const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
