const createPathString = (node) => {
    if(node.depth == 0)
        return node.name;
    
    let pathArray = node.pathname.split('/');
    return pathArray.slice(-(node.depth + 1)).join('/');
}

const disableNodeByType = (node, type) => {
    node.disabled = node.type == type;
    if(node.nodes)
        node.nodes = disableItemsByType(node.nodes, type);
    return node;
}
const disableItemsByType = (items, type) => {
    let disabled = items.map(
        node => disableNodeByType(node, type)
    )
    return disabled;
}

const createListFromTreeview = (treeView, type) => {
    return treeView.reduce(
        (accumulator, current) => {
            if(current.type === type)
                accumulator.push(current.pathname)
            if(current.type === 'dir'){
                return accumulator.concat(createListFromTreeview(current.nodes, type))
            }
            return accumulator
        },
        []
    )
}

export {
    createPathString,
    disableNodeByType,
    disableItemsByType,
    createListFromTreeview
}