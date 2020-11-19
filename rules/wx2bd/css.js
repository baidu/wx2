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
    };
});

module.exports = {
    relativePathsPlugin
};
