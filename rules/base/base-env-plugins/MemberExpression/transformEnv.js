/**
 * @file
 * @des process.env.APP_TYPE 转换
 */

const generate = require('@babel/generator').default;
const types = require('@babel/types');
const {get} = require('lodash');

/**
 * 根据 appType 转换配置进行处理，将 process.env.APP_TYPE 替换为对应的 APP_TYPE
 *
 * @param {Object} context 当前上下文
 * @param {Object} path traverse路径
 * @param {string} file 要转换函数所在的源文件路径
 */
module.exports = function ({path, context, file}) {
    const appType = get(context, 'rules.appType');
    if (appType && generate(path.node).code === 'process.env.APP_TYPE') {
        /**
         * 这里改变了节点类型，将 MemberExpression 改为了 StringLiteral
         * 问题：如果其之后的插件中也遍历了 MemberExpression，该节点依旧会被拦截，若之前的插件修改了节点类型，导致运行报错
         * 解决方式：将该插件放置到最后运行
         * 参考本插件 与 wx2bd/api/plugins/MemberExpression
         * TODO：确认下是否有其他方式 可以避免该问题
         */
        path.replaceWith(types.valueToNode(appType));
    }
};

