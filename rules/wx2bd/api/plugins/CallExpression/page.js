/*eslint-disable*/
/**
 * @des Page中增加onReady方法
 *
 * @param {Object} node traverse节点
 */
const types = require('@babel/types');
const {get} = require('lodash');

module.exports = function ({path, context, file}) {
    if (get(path, 'node.callee.name') !== 'Page') {
        return;
    }

    path.traverse({
        ObjectExpression(path) {
            if (!(get(path, 'parentPath.node.type') === 'CallExpression' && get(path, 'parentPath.node.callee.name') === 'Page')) {
                return;
            }

            const hasOnReady = get(path, 'node.properties').find(e => {
                if (e.key && e.key.name === 'onReady') {
                    return true;
                }
            });

            if (hasOnReady) {
                return;
            }

            get(path, 'node.properties').splice(1, 0,
                types.ObjectMethod('method', types.identifier('onReady'), [], types.BlockStatement([], []))
            );
            path.replaceWith(types.objectExpression(get(path, 'node.properties')));
        }
    });
};
