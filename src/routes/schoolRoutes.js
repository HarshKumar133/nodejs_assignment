const express = require('express');
const schoolController = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middlewares/validation');

const router = express.Router();

router.post('/addSchool', validateAddSchool, schoolController.addSchool);
router.get('/listSchools', validateListSchools, schoolController.listSchools);

module.exports = router;
