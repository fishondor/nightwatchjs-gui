<template>
    <v-container>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr class="overview">
            <td colspan="3" :title="browser"><strong>Browser:</strong> {{browser}}</td>
            </tr>
            <tr class="overview">
            <td colspan="3"><strong>Timestamp:</strong> {{timestamp}}</td>
            </tr>
            <tr class="overview last">
            <td colspan="3"><strong>Tests:</strong> {{results.tests}}<br></td>
            </tr>
            <tr>
            <td class="pass"><strong>{{results.passed}}</strong> passed</td>
            <td class="skip"><strong>{{results.errors}}</strong> errors</td>
            <td class="fail"><strong>{{results.failed}}</strong> failures</td>
            </tr>
        </table>

        <div v-for="(testSuite, testSuiteName) in results.modules" :key="testSuiteName">
            <h2>{{testSuiteName}}</h2>
            <div v-for="(test, testName) in testSuite.completed" :key="testName">
                <h3>{{testName}}</h3>
                <ul class="assertions">
                    <li v-for="(assertion, index) in test.assertions" :key="`assertion_${index}`">
                        <span v-if="assertion.failure" class="error">&#10006;</span>
                        <span v-else class="success">&#10004;</span>
                        <span v-html="parseAnsi(assertion.message)"></span>
                        <span v-if="assertion.failure">{{assertion.failure}}</span>
                        <div v-if="assertion.stacktrace" class="stacktrace">
                            <a href="#">view stacktrace</a>
                            <code><pre>{{assertion.stacktrace}}</pre></code>
                        </div>
                    </li>
                </ul>
                <p>
                    <template v-if="test.failed">
                        <span class="error"><strong>FAILED:</strong></span>
                        <span class="error"><strong>{{test.failed}}</strong></span> assertions failed and
                    </template>
                    <template v-else>
                        <span v-if="!test.failed" class="success"><strong>OK.</strong></span>
                    </template>
                    <span class="success"><strong>{{test.passed}}</strong></span> assertions passed. ({{test.time}}s)
                </p>
            </div>
            <template v-if="testSuite.skipped">
                <h4>skipped</h4>
                <ul>
                    <li v-for="(skipped, skippedKey) in testSuite.skipped" :key="skippedKey">{{skipped}}</li>
                </ul>
            </template>
        </div>

        <hr>
    </v-container>
</template>

<script>
import * as Convert from 'ansi-to-html';

export default {
    data(){
        return {
            results: {},
            browser: '',
            timestamp: ''
        }
    },
    created(){
        this.results = this.$route.params.report;
        this.browser = this.$route.params.browser;
        this.timestamp = this.$route.params.timestamp;
        this.converter = new Convert();
    },
    methods: {
        parseAnsi(text){
            return this.converter.toHtml(text);
        }
    }
}
</script>

<style lang="scss" scoped>

    table { width: 100%; margin-bottom: 20px; }

      td {
        padding: 7px;
        border-top: none;
        border-left: 1px black solid;
        border-bottom: 1px black solid;
        border-right: none;
      }

      td.pass { color: #003b07; background: #86e191; }
      td.skip { color: #7d3a00; background: #ffd24a; }
      td.fail { color: #5e0e00; background: #ff9c8a; }

    tr:last-child       { border-top: 1px black solid; }
      tr:last-child td    { border-top: 1px black solid; }
      tr:first-child td   { border-top: 1px black solid; }
        td:last-child       { border-right: 1px black solid; }

    tr.overview td      { padding-bottom: 0px; border-bottom: none; }
    tr.overview.last td { padding-bottom: 3px; }

    ul.assertions   { list-style-type: none; }
      span.error      { color: #AD2B2B; }
      span.success    { color: #53891E; }

    .stacktrace { display: inline; }
      .stacktrace code { display: none; }

    #nightwatch-logo {
      position: absolute;
      top: 20px;
      right: 33px;
      width: 70px;
      height: 75px;
      background: transparent url('http://nightwatchjs.org/img/logo-nightwatch.png') no-repeat;
      background-size: 70px 75px;
    }
    .container {
        overflow-y: auto;
    }
</style>