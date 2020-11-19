/**
 * @file 针对 相对路径进行转换
 */

const {get, set, has} = require('lodash');

module.exports = function ({path, context, file}) {
    // 相对路径
    const Reg = /^(\/|[a-z]+)[^:]/;
    const importPath = get(path, 'node.source.value');
    if (!importPath) {
        return;
    }

    if (Reg.test(importPath)) {
        const filePath = `./${importPath}`.replace('//', '/');
        set(path, 'node.source.value', filePath);
    }
};
