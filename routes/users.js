const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
