const TYPES_PROPERTIES ={
    'groups': {
        propName: 'selectedTestGroups',
        commandFlag: 'group'
    },
    'single': {
        propName: 'selectedTest',
        commandFlag: 'test'
    }
}

const TESTS_BASE_PATH = 'tests'

const createPathString = (node) => {
    if(node.depth == 0)
        return `${TESTS_BASE_PATH}/${node.name}`;
    
    let pathArray = node.pathname.split('/');
    let testPath = pathArray.slice(-(node.depth + 1)).join('/');
    return `${TESTS_BASE_PATH}/${testPath}`;
}

const createTestPath = (selectedTests) => {
    if(Array.isArray(selectedTests))
            return selectedTests.map(
                test => createPathString(test)
            ).join(',');
        else
            return createPathString(selectedTests);
}

const createTestCommand = (testValues) => {
    if(!Object.keys(testValues).length)
        return 'Nothing specified yet'
    let selectedTests = testValues[TYPES_PROPERTIES[testValues.type].propName];
    let testPath = createTestPath(selectedTests);
    let testEnvironments = testValues.selectedEnvironments.join(',');
    let flag = TYPES_PROPERTIES[testValues.type].commandFlag;
    let envVariables = testValues.environmentVariables.reduce(
        (accumulator, envVariable) => {
            if(envVariable.name && envVariable.value)
                accumulator += `${envVariable.name}=${envVariable.value} `
            return accumulator;
        },
        ''
    )
    return `${envVariables ? envVariables + "&& " : ""}npx nightwatch -e ${testEnvironments} --${flag} ${testPath}`;
}

const indexDirectoryTree = (directoryTree, childrenDirectory) => {
    let index = 0;
    let addId = (item) => {
        item.id = index++;
        if(item[childrenDirectory] && item[childrenDirectory].length){
            item[childrenDirectory] = item[childrenDirectory].map(
                subDirectory => addId(subDirectory)
            )
        }
        return item;
    }
    return directoryTree.map(
        item => addId(item)
    )
}

export {
    createTestCommand,
    indexDirectoryTree
}