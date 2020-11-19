/**
 * @file 处理 onReady 的逻辑
 * Created by wangpanfe on 2019/11/21.
 */
const types = require('@babel/types');
const {get} = require('lodash');

module.exports = function ({path, context, file}) {
    const selectComponentNode = get(context, 'data.selectComponentNode') || {};
    if (get(path, 'node.key.type') === 'Identifier' && get(path, 'node.key.name') === 'onReady') {
        if (!selectComponentNode[file] || selectComponentNode[file].length === 0) {
            return;
        }

        selectComponentNode[file].reverse().forEach(selectedNode => {
            path.get('body').unshiftContainer('body', types.expressionStatement(get(selectedNode, 'node.expression')));
        });
    }
};
