/**
 * @file
 * @author wangpanfe
 * @des api 处理组件中properties属性
 */
const types = require('@babel/types');
const {get} = require('lodash');

/**
 * 转换组件之间上下文关系
 *
 * @param {Object} context 当前上下文
 * @param {Object} path traverse路径
 * @param {string} file 要转换函数所在的源文件路径
 */
module.exports = function ({path, context, file}) {

    path.traverse({
        VariableDeclarator(varPath) {
            const name = get(varPath, 'node.id.name');
            const init = get(varPath, 'node.init');

            if (name !== 'properties' || init.type !== 'ObjectExpression') {
                return;
            }
            const hasFound = init.properties.find(prop => {
                return get(prop, 'key.name') === get(context, 'constant.SWAN_ID_FOR_SYSTEM');
            });
            if (hasFound) {
                return;
            }
            init.properties.push(types.objectProperty(types.identifier(get(context, 'constant.SWAN_ID_FOR_SYSTEM')),
                types.objectExpression([
                    types.objectProperty(types.identifier('type'),
                        types.identifier('String')),
                    types.objectProperty(types.identifier('value'),
                        types.stringLiteral(''))
                ]), false, false, null));
            types.objectExpression(init.properties);
        }
    });
};
