/**
 * @file env-view.js
 * @description 转换不同平台的view代码
 */
const {isArray} = require('lodash');

module.exports = function (context = {}) {
    const envTagReg = /^[wx|swan]+-env/;

    return function transformEnvView(tree, file) {
        if (isArray(tree)) {
            return tree.map(node => transformEnvView(node, file));
        }
        if (tree.type === 'tag') {
            const {name, children} = tree;
            // 不同平台编译不同代码，在所有转化之后
            if (envTagReg.test(name.toString())) {
                tree = tranformEnv(tree, file, context);
            }
            tree.children = children.map(node => transformEnvView(node, file));
        }
        return tree;
    };
};

/**
 * 转换 APP_TYPE-env标签
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 上下文
 * @return {Object} 转换后的节点对象
 */

function tranformEnv(node, file, context) {
    const {rules: viewRules, log} = context;
    const appType = viewRules.appType;

    log.warning({
        type: '二次迭代模板被转换',
        file: file,
        name: node.name
    });

    if (node.name === `${appType}-env`) {
        return node.children;
    }
    return {data: '', type: 'text'};
}
