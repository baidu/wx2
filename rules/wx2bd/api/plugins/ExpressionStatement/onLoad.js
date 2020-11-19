const {get, set, has} = require('lodash');

module.exports = function ({path, context, file}) {
    const expression = get(path, 'node.expression');
    const selectComponentNode = get(context, 'data.selectComponentNode') || {};
    if (expression.type !== 'AssignmentExpression') {
        return;
    }

    // TODO 变量申明的场景待处理
    path.traverse({
        AssignmentExpression(assignPath) {
            const rightNode = get(assignPath, 'node.right');
            if (rightNode.type === 'CallExpression'
                && has(rightNode, 'callee.property')
                && get(rightNode, 'callee.property.name') === 'selectComponent') {
                const parent = assignPath.findParent(assignPath => {
                    return assignPath.isObjectMethod() && get(assignPath, 'node.key.name') === 'onLoad';
                });
                if (!parent) {
                    return;
                }
                // 记录该节点，替换到onReady中
                if (!selectComponentNode[file]) {
                    selectComponentNode[file] = [];
                }
                selectComponentNode[file].push(path);

                if (!has(context, 'data.selectComponentNode')) {
                    return;
                }
                set(context, 'data.selectComponentNode', selectComponentNode);
            }
        }
    });
};

