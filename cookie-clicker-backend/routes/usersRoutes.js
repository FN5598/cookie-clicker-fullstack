const express = require('express');
const { allUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/usersController');
const router = express.Router();

router.get('/', allUsers);

router.post('/', createUser);

router.get("/:id", getUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;