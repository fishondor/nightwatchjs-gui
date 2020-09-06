const { TreeView } = require('node-treeview');
var path = require('path');

const {
    DB_FILE_PATH
} = require('./Environment')();
const DBService = require('./Database');
const Logger = require('./Logger');

class TestsOutputService{

    constructor(){
        this.logger = new Logger("TestsOutput service");
        this.db = new DBService(`${DB_FILE_PATH}/reports.db`);
    }

    async saveReport(doc){
        try{
            let newDoc = await this.db.insert(doc);
            if(!newDoc){
                this.logger.error(`Invalid response in saving report to DB: ${newDoc}`);
                return false;
            }
            this.logger.info(`Successfully saved report`, newDoc);
    
            return newDoc;
        }catch(err){
            this.logger.error(`Error saving report to DB. Error: ${err}`);
            return false;
        }
    }

    async getReports(){
        try{
            let reports = await this.db.getAll();
            if(!reports){
                this.logger.error(`Invalid response from get all reports: ${reports}`);
                return false;
            }
            return reports.map(report => {
                report.report = JSON.parse(report.report);
                return report
            });
        }catch(err){
            this.logger.error(`Error getting all jobs. Error: ${err}`);
            return false;
        }
    }

}

const testsOutputService = new TestsOutputService();

const api = {

    saveReport: async (req, res) => {
        let report = req.body.report;
        try{
            let newDoc = await testsOutputService.saveReport({report: report});
            if(!newDoc){
                res.sendStatus(500);
                return;
            }

            res.json({report: newDoc});
        }catch(err){
            res.sendStatus(500);
        }
    },

    getReports: async (req, res) => {
        try{
            let reports = await testsOutputService.getReports();
            if(!reports){
                res.sendStatus(500);
                return;
            }
            res.json({reports: reports});
        }catch(err){
            res.sendStatus(500);
        }
    }

}

module.exports = {
    api
};