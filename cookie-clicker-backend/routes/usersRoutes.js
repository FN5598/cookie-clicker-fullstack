const express = require('express');
const { allUsers, createUser, getUser, deleteUser, updateUserFactories, autoSave } = require('../controllers/usersController');
const validateToken  = require('../middleware/validateToken');
const router = express.Router();

router.get('/', allUsers);

router.post('/', createUser);

router.get("/:id", getUser);

router.put("/factories/:id", validateToken, updateUserFactories);
router.put("/auto-save/:id", validateToken, autoSave);

router.delete("/:id", deleteUser);

module.exports = router;