const express = require('express');
const router = express.Router();
const expenseCategories = require('../constants/expenseCategories');

// GET /api/meta/categories
router.get('/categories', (req, res) => {
  res.json(expenseCategories);
});

module.exports = router;
