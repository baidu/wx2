/*
 * @Descripttion:
 * @Author: wangpanfe
 * @Date: 2020-03-15 17:22:54
 * @LastEditTime: 2020-03-16 22:56:57
 */
const types = require('@babel/types');
const {get, set, has} = require('lodash');
const SWAN_ID_FOR_SYSTEM = 'swanIdForSystem'; // 解决组件依赖关系的系统添加属性
const relationsMap = {};
let componentName = '';

// 还需要更改
module.exports = function ({path, context, file}) {
    // let api = context.rules.api;
    let linkedBody = '';
    if (get(path, 'node.type') === 'ObjectProperty' && get(path, 'node.key.name') === 'relations') {
        // 获取到relations属性中type的value
        // 获取到relations属性中linked函数
        let relationsValue = '';
        path.traverse({
            ObjectMethod(path) {
                // linked(){}
                if (get(path, 'node.key.name') === 'linked') {
                    linkedBody = get(path, 'node.body');
                }
            },
            ObjectProperty(path) {
                // linked: function(){}
                if (get(path, 'node.key.name') === 'linked') {
                    linkedBody = get(path, 'node.value.body');
                }
                if (get(path, 'node.key.type') === 'StringLiteral' && has(path, 'node.key.value')) {
                    relationsValue = get(path, 'node.key.value') || '';
                    const index = relationsValue.lastIndexOf('./');
                    const lastIndex = relationsValue.lastIndexOf('/');
                    if (lastIndex === -1) {
                        componentName = relationsValue;
                    } else if (lastIndex === 1) {
                        componentName = relationsValue.substring(index + 2);
                    } else {
                        componentName = relationsValue.substring(index + 2, lastIndex);
                    }
                }
                if (path.node.key.name === 'type') {
                    // TODO 同为父子依赖时，待完善
                    // eslint-disable-next-line
                    const action = get(path, 'node.value.value') === 'child' ? 'relationComponentsParent' : 'relationComponentsChild';
                    const pathArr = file.split('/');
                    // 使用了依赖组件的上层组件
                    const dirName = pathArr[pathArr.length - 2];
                    context.Store.dispatch({
                        action,
                        payload: {[dirName]: [componentName]}
                    });
                    relationsMap[relationsValue] = get(path, 'node.value.value');
                }
            }
        });
        if (!linkedBody) {
            path.remove();
            return;
        } else {
            path.replaceWith(types.objectMethod('method', types.identifier('attached'), [], linkedBody, false));
        }
    }
    let selectMethod = '';
    if (path.node.type === 'ObjectProperty' && path.node.key.name === 'methods') {
        // 去掉getRelationNodes调用的参数
        path.traverse({
            MemberExpression(memberPath) {
                if (get(memberPath, 'node.property.type') === 'NumericLiteral'
                    && get(memberPath, 'node.property.value') >= 0) {
                    const node = memberPath.node;
                    if (get(node, 'object.type') === 'CallExpression'
                        && get(node, 'object.callee.type') === 'MemberExpression'
                        && get(node, 'object.callee.property.name') === 'getRelationNodes') {
                        memberPath.replaceWith(
                            types.callExpression(get(memberPath, 'node.object.callee'),
                                get(memberPath, 'node.object.arguments'))
                        );
                    }
                }
            }
        });
        // 替换getRelationNodes逻辑
        path.traverse({
            CallExpression(callPath) {
                if (has(callPath, 'node.arguments[0]') && get(callPath, 'node.arguments[0].type') === 'StringLiteral') {
                    callPath.traverse({
                        MemberExpression(path) {
                            if (get(path, 'node.property.name') === 'getRelationNodes') {
                                const relationsValue = get(callPath, 'node.arguments[0].value') || '';
                                const relationType = relationsMap[relationsValue];
                                if (relationType === 'parent' || relationType === 'ancestor') {
                                    // eslint-disable-next-line
                                    selectMethod = `selectComponent('#${componentName}-'+this.data.${SWAN_ID_FOR_SYSTEM})`;
                                }
                                if (relationType === 'child' || relationType === 'descendant') {
                                    // eslint-disable-next-line
                                    selectMethod = `selectAllComponents('.${componentName}-'+this.data.${SWAN_ID_FOR_SYSTEM})`;
                                }
                                if (!selectMethod) {
                                    return;
                                }
                                // eslint-disable-next-line
                                const relationReplaceCode = `getCurrentPages()[getCurrentPages().length - 1].${selectMethod}`;
                                path.parentPath.replaceWithSourceString(relationReplaceCode);
                            }
                        }
                    });
                }
            }
        });
    }
};
