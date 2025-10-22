const express = require('express');
const { allFactories, createFactory, getFactory, updateFactory, deleteFactory } = require('../controllers/factoriesController');
const router = express.Router();

router.get('/', allFactories);
router.post('/', createFactory);

router.get('/:id', getFactory)
router.put('/:id', updateFactory);
router.delete('/:id', deleteFactory);

module.exports = router