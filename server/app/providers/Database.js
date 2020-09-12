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

    setExpiration(seconds){
        this.db.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: seconds }, (err) => {
            if(err)
                this.logger.error("Error defining expiration time for log documents", err);
        });
    }

    insert(document){
        return new Promise(
            (resolve, reject) => {
                this.db.insert(document, (err, newDoc) => {
                    if(err){
                        this.logger.error("Error inserting document", document, err);
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
                        this.logger.error("Cannot get all documents", err);
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
                        this.logger.error("Cannot delete document", id, err);
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
                        this.logger.error("Cannot update document", id, updateObject, err);
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