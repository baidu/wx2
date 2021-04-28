/**
 * @file wxml convert wx2bd
 */

const fs = require('fs-extra');
const {resolve} = require('path');
const chalk = require('chalk');
const Log = require('./log/log');
const Store = require('./log/store');
const constant = require('./config/constant');
const {mergeJSON, getPlugins} = require('./util');
const {cosmiconfigSync} = require('cosmiconfig');
const pReduce = require('p-reduce');
const explorerSync = cosmiconfigSync('wx2');
const bootstrap = require('./processor/bootstrap');
const Config = require('./processor/transformConfig');
const API = require('./processor/transformAPI');
const JS = require('./processor/transformJS');
const View = require('./processor/transformView');
const Css = require('./processor/transformCss');
const createTransformInfo = require('./processor/createTransformInfo');
const progress = require('../src/util/progress');
const utils = require('./util/index');
const {getSelfRules} = require('./innerTool/rewriteRule');

/**
 * 小程序互转的入口文件
 *
 * @param {Object} options
 * @param {string} options.entry  互转的入口文件
 * @param {string=} options.dist  转换之后的地址
 * @param {string=} options.logFor  转换产生的日志地址
 * @param {string=} options.selfRules  自定义规则地址
 * @param {string=} options.target  要转换的类型 如：wx2swan、wx2qq、swan2wx
 */
module.exports = async function ({entry, dist, logFor, target, selfRules}) {
    const TYPE = getType(target);
    const RULES_PATH = resolve(__dirname, '../rules/', TYPE);

    if (!fs.existsSync(RULES_PATH)) {
        throw new Error('不支持当前的转换类型，只支持百度小程序或微信小程序');
    }
    if (!utils.isWin() && ((dist && dist.indexOf('\\') > -1) || (logFor && logFor.indexOf('\\') > -1))) {
        console.log('路径中包含反斜线等非法字符！');
        return;
    }

    const logInstance = new Log(logFor);
    const CONTEXT = {
        type: TYPE,
        status: constant.TRANSFORM_WAIT,
        constant,
        entry,
        dist,
        rules: getRules(RULES_PATH, TYPE),
        log: logInstance,
        Store,
        selfRules,
        data: {}
    };

    // 判断自定义规则是否存在，如果存在则进行规则merge
    if (selfRules) {
        let {plugin, baseRules} = getSelfRules(CONTEXT);
        // 自定义规则处理
        for (let item in CONTEXT.rules) {
            baseRules[item]
            && (CONTEXT.rules[item] = Object.assign(CONTEXT.rules[item], baseRules[item]));
        }
        // 自定义插件处理
        for (let item in CONTEXT.rules.api.babelPlugins) {
            plugin[item]
            && (CONTEXT.rules.api.babelPlugins[item] = CONTEXT.rules.api.babelPlugins[item].concat(plugin[item]));
        }
    }   

    try {
        // 获取文件总数
        progress.getAllFile(entry);
    } catch (e) {
        console.log(e);
    }

    console.log(chalk.green('🎉    Transforming  ...'));

    const wxProcessor = [
        {
            name: 'Bootstrap',
            handle: bootstrap.transformBootstrap
        }, {
            name: 'Api',
            handle: API.transformApi
        }, {
            name: 'Config',
            handle: Config.transformConfig
        }, {
            name: 'View',
            handle: View.transformView
        }, {
            name: 'TransformInfo',
            handle: createTransformInfo
        }
    ];
    const defaultProcessor = wxProcessor.concat([
        {
            name: 'JS',
            handle: JS.transformJS
        }, {
            name: 'Css',
            handle: Css.transformCss
        }
    ]);


    const processor = TYPE === constant.WECHAT_TO_WECHAT ? wxProcessor : defaultProcessor;

    await pReduce(processor, async (placeholder, item) => {
        item.handle.decorate = function (beforefn, afterfn) {
            const _self = this;
            return async function () {
                beforefn.apply(this, arguments);
                try {
                    await _self.apply(this, arguments);
                } catch (error) {
                    logInstance.error({
                        progress: `[FAILURE] ${item.name} failure`,
                        error
                    });
                    throw error;
                }
                afterfn.apply(this, arguments);
            };
        };
        const handleDecorate = item.handle.decorate(() => {
            logInstance.info({
                progress: `[START] transforming ${item.name}`
            });
        }, () => {
            // console.log(chalk.cyan(`🎉    Successfully for ${item.name}`));
            logInstance.info({
                progress: `[DONE] transforming ${item.name} done`
            });
        });
        await handleDecorate(CONTEXT);
    }, 0);

    // 日志转存
    logInstance.dump();

    // 完成进度
    global.emitter.emit('event', true);

    console.log(chalk.green('🎉    Ok, check transform log in ')
        + chalk.blue.underline.bold('wx2_log/')
    );

};

/**
 * 获取转换类型
 *
 * @param {string=} target 转换类型默认是 swan
 * @return {string} 转换类型
 */
function getType(target) {
    switch (target) {
        case 'swan':
            return constant.WECHAT_TO_SWAN;
        case 'qq':
            return constant.WECHAT_TO_QQ;
        case 'wx':
            return constant.WECHAT_TO_WECHAT;
        case 'bd2wx':
            return constant.SWAN_TO_WECHAT;
        default:
            return constant.WECHAT_TO_SWAN;
    }
}

/**
 * 获取项目转换需要的 rules
 *
 * @param {string}  rules的文件地址
 * @return {Object}所有的规则
 */
function getRules(rulesPath, transformType) {
    const result = explorerSync.search(process.argv[2]);
    const rules = require(rulesPath);
    const customProCfg = result && result.config || {
        projectType: 'u-design',
    };

    rules.api.babelPlugins = getPlugins(rulesPath, transformType);
    mergeJSON(rules.api, customProCfg);
    return rules;
}
