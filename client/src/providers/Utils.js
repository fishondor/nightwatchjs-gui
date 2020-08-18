const createPathString = (node) => {
    if(node.depth == 0)
        return node.name;
    
    let pathArray = node.pathname.split('/');
    return pathArray.slice(-(node.depth + 1)).join('/');
}

export {
    createPathString
}