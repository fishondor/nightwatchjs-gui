const express = require('express');
const router = express.Router();

const testsService = require('./providers/tests');
const cronJobsService = require('./providers/cronJobs');

router.get( '/groups', testsService.getTestsTreeView);
router.get( '/tests', testsService.getTestsTreeView);
router.get( '/tests-environments', testsService.getTestEnvironments);
router.get( '/variables-environments', testsService.getVariablesEnvironments)
router.post( '/run-test', testsService.runTest);
router.post( '/run-test-group', testsService.runTestGroup);
router.get( '/jobs', cronJobsService.getJobs);
router.post( '/job/:action', cronJobsService.jobActions );
router.post( '/job', cronJobsService.registerJob);

module.exports = router;

