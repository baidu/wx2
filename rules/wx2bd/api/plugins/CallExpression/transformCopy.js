/**
 * @file 针对 setClipboardData 转换
 */
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const {get, set, has} = require('lodash');

const stringTemp = 'xKsuhgjHsbn';
module.exports = function ({path, context, file}) {
    if (!has(path, 'node.callee.property') || get(path, 'node.callee.property.name') !== 'setClipboardData') {
        return;
    }
    let hasSuccess = false;
    let hasTitle = false;
    path.traverse({
        ObjectMethod(methodPath) {
            if (get(methodPath, 'node.key.name') !== 'success') {
                return;
            }
            hasSuccess = true;
            methodPath.traverse({
                Identifier(stringPath) {
                    if (get(stringPath, 'node.name') === 'title') {
                        hasTitle = true;
                    }
                }
            });
            if (hasTitle) {
                return;
            }
            methodPath.get('body').unshiftContainer(
                'body', t.expressionStatement(t.stringLiteral(stringTemp))
            );

            methodPath.traverse({
                Literal(directivePath) {
                    if (get(directivePath, 'node.value') === stringTemp) {
                        const code = 'swan.showToast({title: \'内容已复制\'})';
                        directivePath.parentPath.replaceWithSourceString(code);
                    }
                }
            });
        }
    });
    if (hasSuccess) {
        return;
    }

    // 没有设置success回调
    path.traverse({
        ObjectExpression(expressionPath) {
            if (hasSuccess) {
                return;
            }
            const propertyOne = get(expressionPath, 'node.properties[0]');
            const code = '{' + generate(propertyOne).code + ',' + `success(res) {
                swan.showToast({
                    title: '内容已复制'
                });
            }}`;
            hasSuccess = true;
            expressionPath.replaceWithSourceString(code);
        }
    });
};
