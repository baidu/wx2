/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const {version, name} = require('../../package.json');

/**
 * 生成转换工具信息文件
 *
 * @param {Object}  context 上下文信息
 */

module.exports = async function (context) {
    const filePath = path.join(context.dist, '.wx2info');
    const con = `{
    "toolName": "${name}",
    "toolCliVersion": "${version}",
    "createTime": ${new Date().toLocaleString()}
}`;
    return fs.writeFile(filePath, con);
};
