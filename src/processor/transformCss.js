/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
'use strict';

const {transformCssStaticUrl, getContent, saveFile, getFiles} = require('../util/index');
const postcss = require('postcss');
const {forEach} = require('lodash');

/**
 * 对文件中的css进行转换
 *
 * @param {Object} context 函数上下文
 */
exports.transformCss = async function transformCss(context) {
    const suffix = context.rules.suffixMapping.css;
    const files = await getFiles(context.dist, suffix);


    await Promise.all(files.map(async file => {
        let content = await getContent(file);
        content = await exports.transformCssContent(file, content, context);
        await saveFile(file, content);
        // 更新进度
        global.emitter.emit('event', false);
    }));
};

exports.transformCssContent = function transformCssContent(file, content, context) {
    // 无请求头的css静态资源url添加https请求头
    content = transformCssStaticUrl(content);
    const cssRules = context.rules.css;
    const cssPlugins = [];
    forEach(cssRules, (process, pluginName) => {
        cssPlugins.push(process({context, file}));

    });
    return postcss(cssPlugins).process(content, {from: ''}).catch(error => {
        context.log.error({
            progress: '[FAILURE] transforming css failure',
            path: file,
            error: error.toString()
        });
    });
};
