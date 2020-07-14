const { readdirSync } = require('fs');
var exec = require('child_process').exec;

const extractTestsNames = (testsFolders, delimiter = '/') => {
    let names = testsFolders.reduce(
        (accumulator, folder) => {
            if(!folder.subDirectories.length){
            accumulator.push(folder.name);
            return accumulator;
            }
            accumulator.push(folder.name);
            let subDirectories = extractTestsNames(folder.subDirectories);
            subDirectories.map(
            subDirectory => accumulator.push(`${folder.name}${delimiter}${subDirectory}`)
            );
            return accumulator;
        },
        []
    )
    return names;
}

const getDirectories = (source) => {
    let directories = readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());
    directories = directories.map(
        directory => {
            directory.subDirectories = getDirectories(source + "/" + directory.name);
            return directory;
        }
    )
    return directories;
}

const extractEnvironments = (path) => {
    let configFiles = readdirSync(path, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory());
    let environments = configFiles.reduce(
        (accumulator, filename) => {
            let config = require(`${path}/${filename.name}`);
            Object.keys(config).map(
                key => accumulator.push(key)
            );
            return accumulator;
        },
        []
    )
    return environments;
}

const executeCommand = (command) => {
    return new Promise(
        (resolve, reject) => {
            exec(command, function(error, stdout, stderr){ resolve(stdout) });
        }
    )
};

const executeTestGroup = async (testGroup, browsers, variablesEnvironment) => {
    let command = `cd .. && ${variablesEnvironment ? "TESTS_ENV=" + variablesEnvironment + " " : ''}npx nightwatch -e ${browsers} --group ${testGroup}`;
    let response = await executeCommand(command);
    return response;
}

const executeTest = async (test, browsers, variablesEnvironment) => {
    let command = `cd .. && ${variablesEnvironment ? "TESTS_ENV=" + variablesEnvironment + " " : ''}npx nightwatch -e ${browsers} tests/${test}`;
    console.log("Executing", command);
    let response = await executeCommand(command);
    return response;
}

const parseArrayURLString = (urlString) => {
    return urlString.replace(/\[|\]|'/gi,'').split(',');
}

module.exports = {
    extractTestsNames,
    getDirectories,
    extractEnvironments,
    executeTestGroup,
    executeTest,
    parseArrayURLString
}