/**
 * @file  自定义规则转换
 */

const {resolve} = require('path');
const {isDirectory, getPlugins} = require('../../src/util');

exports.getSelfRules = function(context) {
    rulePath = context.selfRules;
    let ruleConfig = {
        plugin: {},
        baseRules: {}
    };
    // 自定义path，无则return
    if (!rulePath) {
        return;
    }
    // 解析文件夹路径，无则return
    const path = resolve(rulePath);
    try {
        if (!isDirectory(path)) {
            return;
        }
        // 获取自定义文件夹下的wx2.json文件
        let wx2JSON = require(`${path}/wx2.json`);
        // 合并自定义规则
        wx2JSON && (ruleConfig.baseRules = wx2JSON);
        // 合并自定义插件
        let plugins = getPlugins(path, context.type);
        plugins && (ruleConfig.plugin = plugins);
    } catch(e) {
        throw new Error('自定义规则不符合规范');
    }
    return ruleConfig;
}