const TESTS_BASE_PATH = 'tests'

const createPathString = (node) => {
    if(node.depth == 0)
        return `${TESTS_BASE_PATH}/${node.name}`;
    
    let pathArray = node.pathname.split('/');
    let testPath = pathArray.slice(-(node.depth + 1)).join('/');
    return `${TESTS_BASE_PATH}/${testPath}`;
}

export {
    createPathString
}