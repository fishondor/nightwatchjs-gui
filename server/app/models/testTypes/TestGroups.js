const TestBase = require('../TestBase');

class TestGroups extends TestBase{

    get testCommand(){
        return `--group ${this.tests.join(',')}`;
    }

}

module.exports = TestGroups