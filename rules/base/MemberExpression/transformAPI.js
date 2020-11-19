/**
 * @file
 * @des api 映射及 API转换
 */
const generate = require('@babel/generator').default;
const {getNodeMethodName} = require('../../../src/util');
const {get, set} = require('lodash');

/**
 * 根据Api转换配置进行处理
 *
 * @param {Object} context 当前上下文
 * @param {Object} path traverse路径
 * @param {string} file 要转换函数所在的源文件路径
 */
module.exports = function ({path, context, file}) {

    const logInstance = context.log;
    const prefix = get(path, 'node.object.name');
    const {currentPrefix, targetPrefix, API} = get(context, 'rules.api');

    const conf = {
        message: '替换前缀名称',
        logLevel: 'warning',
        file,
        beforeCode: generate(path.node).code
    };

    // 避免多余转换
    if (prefix !== currentPrefix || prefix === targetPrefix) {
        return;
    }
    // 替换名称
    // TODO: 如果这是用于babel plugin的话，直接操作path里的node，在多个babel plugin一起操作同一个node的时候是会冲突的，建议用replace之类的函数去处理
    set(path, 'node.object.name', targetPrefix);
    const method = getNodeMethodName(path.node);

    // 获取操作动作
    Object.assign(conf, API[method]);


    if (conf.action === 'map') {
        path.get('property').replaceWithSourceString(conf.mapping);
    }

    conf.afterCode = generate(path.node).code;

    if (conf.action === 'delete') {
        const defaultCode = `${targetPrefix}.showToast({
                                title: '${method}暂时不支持，请酌情处理',
                                icon: 'none',
                             })`;

        const code = conf.customFunction ? conf.customFunction : defaultCode;
        path.parentPath.replaceWithSourceString(code);

        conf.afterCode = code;
    }

    logInstance[conf.logLevel](conf);
};


