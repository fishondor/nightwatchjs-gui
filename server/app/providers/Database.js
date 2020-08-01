var Datastore = require('nedb');

const Logger = require('./Logger');

class DbService{

    constructor(path){
        this.logger = new Logger("Database service");
        this.db = new Datastore({ 
            filename: path, 
            autoload: true,
            timestampData: true 
        });
    }

    insert(document){
        return new Promise(
            (resolve, reject) => {
                this.db.insert(document, function (err, newDoc) {
                    if(err){
                        this.logger("Error inserting document", document, err);
                        reject();
                        return;
                    }
                    resolve(newDoc);
                });
            }
        )
    }

    getAll(){
        return new Promise(
            (resolve, reject) => {
                this.db.find({}, function (err, docs) {
                    if(err){
                        this.logger("Cannot get all documents", err);
                        reject();
                        return;
                    }
                    resolve(docs);
                });
            }
        )
    }

    delete(id){
        return new Promise(
            (resolve, reject) => {
                this.db.remove({ _id: id }, {}, function (err, numRemoved) {
                    if(err){
                        this.logger("Cannot delete document", id, err);
                        reject();
                        return;
                    }
                    resolve(numRemoved);
                });
            }
        )
    }

    update(id, updateObject){
        return new Promise(
            (resolve, reject) => {
                this.db.update({ _id: id }, { $set: updateObject }, {returnUpdatedDocs: true}, function (err, numReplaced, updatedDoc) {
                    if(err){
                        this.logger("Cannot update document", id, updateObject, err);
                        reject();
                        return;
                    }
                    resolve(updatedDoc);
                });
            }
        )
    }
}

module.exports = DbService;