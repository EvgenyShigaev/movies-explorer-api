const router = require('express').Router();

const {
  validationUser,
} = require('../middlewares/validation');

const {
  getUsers, updateUser,
} = require('../controllers/users');

router.get('/me', getUsers);
router.patch('/me', validationUser, updateUser);

module.exports = router;
