/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';

/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';
const postcss = require('postcss');

const relativePathsPlugin = postcss.plugin('postcss-match-relative-paths', ({context, file}) => {
    return (root, result) => {
        root.walkAtRules('import', decl => {
            decl.params = decl.params.replace(/\.(wxss|css)/ig, '.' + context.rules.suffixMapping.css);
        });
        // 只有微信不支持相对目录引入，所以加上这个判断
        root.walkDecls(/^background(-image)?$/, decl => {
            const {prop, value, source: {end}} = decl;
            const hasUrl = /^url/.test(value);
            if (!hasUrl) {
                return;
            }
            const filePath = (/\burl\s*?\((['"]?)([^)]+)\1\)/.exec(value) || [])[2];
            if (!filePath) {
                return;
            }
            if (!/^(https?|data):/.test(filePath)) {
                // eslint-disable-next-line
                context.log.error('存在引用相对路径的图片：\n', '文件为：' + file + ' 的第 ' + end.line + ' 行\n', '属性为：' + prop + ': ' + value);
            }
        });
    };
});

module.exports = {
    relativePathsPlugin
};

