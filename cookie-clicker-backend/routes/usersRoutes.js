const express = require('express');
const { allUsers, createUser, getUser, deleteUser, updateUserCookies, updateUserFactories } = require('../controllers/usersController');
const validateToken  = require('../middleware/validateToken');
const router = express.Router();

router.get('/', allUsers);

router.post('/', createUser);

router.get("/:id", getUser);

router.put("/cookies/:id", validateToken, updateUserCookies);
router.put("/factories/:id", validateToken, updateUserFactories);

router.delete("/:id", deleteUser);

module.exports = router;