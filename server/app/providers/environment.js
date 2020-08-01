var TESTS_ROOT_DIRECTORY = process.cwd();
if(process.env.ENV && process.env.ENV == 'dev') TESTS_ROOT_DIRECTORY += '/../';

const DB_FILE_PATH = `${TESTS_ROOT_DIRECTORY}nightwatchjs-gui-db/cron_jobs.db`;

module.exports = {
    TESTS_ROOT_DIRECTORY,
    DB_FILE_PATH
}