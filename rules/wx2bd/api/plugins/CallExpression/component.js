/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
const propertiesString = 'xXksjUhmbvhaks'; // 临时字面量
const types = require('@babel/types');
const {get} = require('lodash');

module.exports = function ({path, context, file}) {
    const {constant = {}, data = {}, isDesgin} = context;
    if (get(path, 'node.callee.name') !== 'Component') {
        return;
    }

    path.traverse({
        ObjectExpression(path) {
            if (!(get(path, 'parentPath.node.type') === 'CallExpression'
                && get(path, 'parentPath.node.callee.name') === 'Component')) {
                return;
            }

            let hasProperties = false;
            path.node.properties.find(e => {
                if (e.key && e.key.name === 'properties') {
                    hasProperties = true;
                    if (e.value.type !== 'ObjectExpression') {
                        const propertiesPath = data.propertiesPath || {};
                        propertiesPath[file] = true;
                        data.propertiesPath = propertiesPath;
                        return;
                    }

                    const hasFound = e.value.properties.find(prop => {
                        return prop.key.name === constant.SWAN_ID_FOR_SYSTEM;
                    });
                    if (hasFound) {
                        return;
                    }
                    e.value.properties.push(types.objectProperty(types.identifier(constant.SWAN_ID_FOR_SYSTEM),
                        types.objectExpression([
                            types.objectProperty(types.identifier('type'),
                                types.identifier('String')),
                            types.objectProperty(types.identifier('value'),
                                types.stringLiteral('123445'))
                        ]), false, false, null));
                    e.value = types.objectExpression(e.value.properties);
                }
            });
            if (hasProperties) {
                return;
            }

            path.node.properties.splice(2, 0, types.objectProperty(types.identifier('properties'),
                types.stringLiteral(propertiesString), false, false, null));
            path.replaceWith(types.objectExpression(get(path, 'node.properties')));

            path.traverse({
                StringLiteral(strPath) {
                    if (strPath.node.value === propertiesString) {
                        const code = `{length: {type: Number,value: 2}, 
                        ${constant.SWAN_ID_FOR_SYSTEM}:{type: String,value: ''}}`;
                        strPath.replaceWithSourceString(code);
                    }
                },
                VariableDeclarator(varPath) {
                    // TODO 变量名不为width呢
                    if (isDesgin && get(varPath, 'node.id.name') === 'width') {
                        const code = 'width = 100 / this.data.length';
                        varPath.replaceWithSourceString(code);
                    }
                }
            });
        }
    });
};
