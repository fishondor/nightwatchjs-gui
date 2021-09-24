const express = require('express');
const router = express.Router();

const testsService = require('./providers/tests');
const cronJobsService = require('./providers/cronJobs');
const testsOutputService = require('./providers/testsOutput');

router.get( '/groups', testsService.api.getTestsTreeView );
router.post( '/tests/command', testsService.api.getTestsCommand);
router.get( '/tests/list', testsService.api.getTestsList);
router.get( '/tests', testsService.api.getTestsTreeView );
router.get( '/tests-environments', testsService.api.getTestEnvironments );
router.post( '/run-test', testsService.api.runTest );
router.get( '/jobs', cronJobsService.getJobs );
router.get( '/job/:action/:id', cronJobsService.jobActions );
router.delete( '/job/:id', cronJobsService.deleteJob );
router.post( '/job', cronJobsService.registerJob );
router.post( '/report', testsOutputService.api.saveReport );
router.get( '/reports', testsOutputService.api.getReports );

module.exports = router;

