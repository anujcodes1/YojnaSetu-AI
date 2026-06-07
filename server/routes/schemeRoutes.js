// schemeRoutes.js
const express = require('express');
const r1 = express.Router();
const { getSchemes, getSchemeById, getCategories } = require('../controllers/schemeController');
r1.get('/categories', getCategories);
r1.get('/', getSchemes);
r1.get('/:id', getSchemeById);
module.exports = r1;
