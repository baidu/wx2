/**
 * @file
 * @des 进行require的项目路径的转换
 */

const {set} = require('lodash');

module.exports = function ({path, context, file}) {
    const {callee, arguments: requireArguments} = path.node;
    if (callee.name !== 'require') {
        return;
    }
    // TODO: 有可能是绝对
    const Reg = /^(\/|[a-z]+)[^:]/;
    if (Reg.test(requireArguments[0].value)) {
        const filePath = `./${requireArguments[0].value}`.replace('//', '/');
        set(path, 'node.arguments[0].value', filePath);
    }
};
