/**
 * @file
 * @des api 映射及 API转换
 */
const generate = require('@babel/generator').default;
const logInstance = require('../../../../../src/log/log');
const {getNodeMethodName} = require('../../../../../src/util');
const {has, get, set} = require('lodash');

/**
 * 根据Api转换配置进行处理
 *
 * @param {string} ctx 当前函数命名空间
 * @param {Object} path traverse路径
 * @param {string} file 要转换函数所在的源文件路径
 */
module.exports = function ({path, context, file}) {
    const name = get(path, 'node.object.name');
    const api = get(context, 'rules.api');
    const {ctx, prefix} = api;
    let logInfo = {
        message: '替换前缀名称',
        logLevel: 'warning',
        file,
        beforeCode: generate(path.node).code
    };
    if (!has(path, 'node.property.value')) {
        return;
    }
    if (name !== prefix) {
        return;
    }
    // 替换名称
    set(path, 'node.object.name', ctx[name]);
    const method = getNodeMethodName(path.node);

    // 获取操作动作
    if (!(method && api[prefix] && api[prefix][method])) {
        const conf = api[prefix][method];
        logInfo = Object.assign(logInfo, conf);
    }

    if (logInfo.action === 'mapping') {
        api[prefix][method].mapping
            ? set(path, 'node.property.value', api[prefix][method].mapping)
            : set(path, 'node.property.value', method);
    }

    logInfo.afterCode = generate(path.node).code;
    logInstance[logInfo.logLevel](logInfo);
};

