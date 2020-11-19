/**
 * @file wxml convert wx2bd
 */
'use strict';
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const vfile = require('vfile');
const log = require('../log/log');
const {Parser, DomHandler} = require('stricter-htmlparser2');
const glob = require('glob');
const parse = require('./view/parse');
const stringify = require('./view/stringify');
const wxmlToSwan = require('./view/wxml-to-swan');
const envView = require('./view/env-view');
const constant = require('../config/constant');
const os = require('os');
global.cache = Object.create(null);

/**
 * 判断路径是否为文件夹
 *
 * @param {string} entryPath 文件路径
 * @returns {boolean}  文件内容
 */
exports.isDirectory = function (entryPath) {
    if (global.cache[entryPath] !== undefined) {
        return global.cache[entryPath];
    }
    global.cache[entryPath] = fs.statSync(entryPath).isDirectory();

    return global.cache[entryPath];
};

/**
 * 异步获取文件内容
 *
 * @param {string} path 文件路径
 * @returns {string}  文件内容
 */
exports.getContent = function (path) {
    return fs.readFile(path).then(data => data.toString()).catch(e => {
        log.notice(e);
        return '';
    });
};

/**
 * 同步获取文件内容
 *
 * @param {string} path 文件路径
 * @returns {string}  文件内容
 */
exports.getContentSync = function (path) {
    return fs.readFileSync(path).toString();
};

/**
 * 保存文件
 *
 * @param {string} path 文件存储路径
 * @param {string} con 写入内容
 * @param {string} options 写入文件的参数
 * @returns {Object}
 */
exports.saveFile = function (path, con, options) {
    return fs.outputFile(path, con, options);
};

/**
 * 保存log日志
 *
 * @param {string} ContentPath 文件存储路径
 * @param {string} con 写入内容
 */
exports.saveLog = function (ContentPath, con) {
    return new Promise((resolve, reject) => {
        mkdirp(path.dirname(ContentPath), err => {
            if (err) {
                reject(err);
            } else {
                fs.writeFileSync(ContentPath, con);
            }
        });
    });
};

/**
 * object to json string
 *
 * @param {Object} obj
 * @return {string}
 */
exports.object2String = function (obj) {
    const cache = [];
    return JSON.stringify(obj, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }

        return value;
    }, 4);
};


/**
 * 替换文档后缀
 *
 * @param {string} filePath 文件路径
 * @param {string} contents 文件内容
 * @param {Object} context 上下文
 * @return {string} 处理后的文件
 */
exports.toVFile = function (filePath, contents, context) {
    const file = vfile({
        path: filePath,
        contents: contents
    });
    const SUFFIX = {
        SWAN_HTML: 'swan',
        SWAN_CSS: 'css',
        WECHAT_CSS: 'wxss',
        WECHAT_HTML: 'wxml',
        JS_FILE: 'js',
        JSON_FILE: 'json'
    };
    const WECHAT_TO_SWAN = context.type === 'WECHAT_TO_SWAN';
    const RELATED = {
        style: WECHAT_TO_SWAN ? SUFFIX.SWAN_CSS : SUFFIX.WECHAT_CSS,
        view: WECHAT_TO_SWAN ? SUFFIX.SWAN_HTML : SUFFIX.WECHAT_HTML,
        js: SUFFIX.JS_FILE,
        config: SUFFIX.JSON_FILE
    };

    const {
        cwd,
        dirname,
        stem,
        extname
    } = file;

    file.data.relatedFiles = Object.keys(RELATED).reduce((prev, type) => {
        const ext = `.${RELATED[type]}`;
        if (ext !== extname) {
            const filePath = path.resolve(cwd, dirname, stem + ext);
            // 判断路径是否存在
            fs.existsSync(filePath) && (prev[type] = filePath);
            prev[type] = filePath;
        }
        return prev;
    }, {});
    return file;
};

/**
 * 无请求头的css静态资源url添加https请求头
 *
 * @param {string} content 文件内容
 * @return {string} 处理后文件内容
 */
exports.transformCssStaticUrl = function (content) {
    content = content.replace(/url\((.*)\)/g, function ($1, $2) {
        if (!$2) {
            return $1;
        }
        const res = $2.replace(/^(['"\s^]?)(\/\/.*)/, function ($1, $2, $3) {
            return `${$2}https:${$3}`;
        });
        return `url(${res})`;
    });
    return content;
};

/**
 * 获取parser和handler
 *
 * @param {Object} options Parser函数的参数
 * @returns {Object} DomHandler的实例和 Parser 的实例
 */
exports.getHtmlParser = function (options) {
    options = options || {
        xmlMode: false,
        lowerCaseAttributeNames: false,
        recognizeSelfClosing: true,
        lowerCaseTags: false
    };
    const handler = new DomHandler();
    const htmlParser = new Parser(handler, options);
    return {
        htmlParser,
        handler
    };
};

/**
 * 获取对象方法调用成员表达式中的方法名称
 *
 * @param {Object} node traverse节点
 */
exports.getNodeMethodName = function (node) {

    if (node.callee) {
        const type = node.callee.type;
        if (type === 'MemberExpression') {
            return node.callee.property.name;
        }
    } else {
        const stringLiteralMethod = node.property.value;
        const identifierMethod = node.property.name;
        return node.property.type === 'StringLiteral' ? stringLiteralMethod : identifierMethod;
    }


};


/**
 * JSON合并（递归深度合并）
 *
 * @param  {Object} 主对象
 * @param  {Object} 合并对象
 */

exports.mergeJSON = function mergeJSON(main, minor) {
    for (const key in minor) {

        if (main[key] === undefined) {
            main[key] = minor[key];
            continue;
        }
        // 不是Object 则以（a）为准为主，
        if (isJSON(main[key])) {
            // arguments.callee(a[key], minor[key]);
            mergeJSON(main[key], minor[key]);
        } else {
            main[key] = minor[key];
        }
    }
};


/**
 * 判断是否为JSON
 *
 * @return {boolean}
 */
function isJSON(target) {
    return typeof target === 'object' && target.constructor === Object;
}

/**
 * 判断是win 环境还是 mac
 *
 * @return {boolean}
 */
exports.isWin = function () {
    const platform = os.platform();
    return /win\d+/ig.test(platform);
};

/**
 * 获取文件的类型
 *
 * @param {string} filePath 文件路径
 * @return {Object}  babel的类型对应的函数
 */
exports.getPlugins = function (rulesPath, transformType) {
    const isWx2Wx = transformType === constant.WECHAT_TO_WECHAT;
    const types = [
        'MemberExpression', 'CallExpression', 'ObjectProperty',
        'StringLiteral', 'ExpressionStatement', 'ObjectMethod', 'ImportDeclaration', 'VariableDeclaration'
    ];
    const babelPlugins = {};

    types.map(type => {
        const baseEnvPluginsPath = path
            .resolve(rulesPath, '../base/base-env-plugins', type, '*.js').replace(/\\/g, '/');
        const basePluginsPath = path.resolve(rulesPath, '../base', type, '*.js').replace(/\\/g, '/');
        const pluginsPath = path.resolve(rulesPath, './api/plugins', type, '*.js').replace(/\\/g, '/');

        // 保证 baseEnvPluginsPath 在最后运行，保证 transformEnv.js 中改变节点类型不影响其他插件
        const allPlugins = isWx2Wx ? [baseEnvPluginsPath] : [basePluginsPath, pluginsPath, baseEnvPluginsPath];

        let files = [];
        allPlugins.forEach(item => {
            files = files.concat(glob.sync(item));
        });

        // const files = glob.sync(allPlugins);

        if (!files.length) {
            return;
        }
        babelPlugins[type] = files.map(plugin => {
            return require(plugin);
        });
    });
    return babelPlugins;
};

/**
 * 获取文件的类型
 *
 * @param {string} filePath 文件路径
 * @return {string}  返回文件类型
 */
exports.getFileType = function (filePath) {
    if (/\.(swan|wxml)$/.test(filePath)) {
        return 'view';
    }
    if (/\.(css|wxss)$/.test(filePath)) {
        return 'css';
    }
    if (/\.(wxs|sjs|filter\.js)$/.test(filePath)) {
        return 'script';
    }
    if (/\.(json)$/.test(filePath)) {
        return 'json';
    }
    return null;
};

/**
 * 获取指定 suffix name 的 file
 *
 * @param {string} disk 文件夹路径
 * @param {string} suffix 文件后缀名称
 */
exports.getFiles = async function (dist, suffix) {
    let filePath = `${dist}/**/*.${suffix}`;

    filePath = filePath.replace(/\\/g, '/');
    return glob.sync(filePath, {
        ignore: [
            '**/pass_utils/**', '**/pass_requestapi/**',
            '**/wx2_log/**', '**/package.json', '**/package-lock.json', '**/node_modules/**'
        ]
    });
};

/**
 * 判断是否为 json
 *
 * @param {string}
 */
exports.isJsonStr = function (str) {
    try {
        const obj = JSON.parse(str);
        return !!obj && typeof obj === 'object';
    } catch (e) {}
    return false;
};

/**
 * wxml 语法转换成 swan语法
 *
 * @param {Object} context 上下文信息
 */
exports.wxmlToSwan = wxmlToSwan;

/**
 * 转换env模板语法
 *
 * @param {Object} context 上下文信息
 */
exports.envView = envView;

/**
 * 视图ast序列化插件
 */
exports.stringify = stringify;


/**
 * 视图astz序列化
 */
exports.parse = parse;
