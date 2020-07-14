const express = require('express');
const router = express.Router();

const testsService = require('./providers/tests');

router.get( '/groups', testsService.getTestGroups);
router.get( '/tests', testsService.getTests);
router.get( '/tests-environments', testsService.getTestEnvironments);
router.get( '/variables-environments', testsService.getVariablesEnvironments)
router.post( '/run-test', testsService.runTest);
router.post( '/run-test-group', testsService.runTestGroup);

module.exports = router;

