/*
 * @Descripttion: 替换export中点wx关键词，处理api批量挂载的情形
 * @Author: wangpanfe
 */
const {has, get, set} = require('lodash');
module.exports = function ({path, context, file}) {

    if (has(path, 'node.value')
        && get(path, 'node.value.type') === 'Identifier'
        && get(path, 'node.value.name') === 'wx'
        && context.type === context.constant.WECHAT_TO_SWAN) {
        set(path, 'node.value.name', 'swan');
    }
};
