const TestBase = require('../TestBase');

class TestSingle extends TestBase{

    get testCommand(){
        return `--test ${this.tests[0]}`;
    }

}

module.exports = TestSingle