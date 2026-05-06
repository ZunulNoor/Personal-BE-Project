const express = require('express');
const router = express.Router();
const { getCountries } = require('./Controller');

router.get('/get-countries', getCountries);

module.exports = router;
