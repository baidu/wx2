/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
'use strict';

const {
    forEach,
    isEmpty
} = require('lodash');
const {getContent, saveFile, getFiles, isJsonStr} = require('../util/index');
const kebabCase = require('lodash/kebabCase');
const contextStore = require('../log/store.js');
const constant = require('../config/constant');
const {basename} = require('path');


exports.transformConfig = async function (context) {

    const files = await getFiles(context.dist, 'json');
    const isWx2Wx = context.type === constant.WECHAT_TO_WECHAT;

    const promise = files.map(async file => {
        const content = await getContent(file);
        const transformFn = isWx2Wx ? exports.transformEnvConfig : exports.transform;
        const result = transformFn(file, content, context);
        !isWx2Wx && await exports.transformProjectConfig(file, context);
        await saveFile(file, result.contents);
        // 更新进度
        global.emitter.emit('event', false);

        // 把重命名信息放到contextStore中
        const {componentRenameMap} = result.data;

        // TODO 给transform View 时使用
        if (!isEmpty(componentRenameMap)) {
            contextStore.dispatch({
                action: 'usingComponentsMap',
                payload: {
                    ...(contextStore.usingComponentsMap || {}),
                    [file]: componentRenameMap
                }
            });
        }
    });

    await Promise.all(promise);
};

/**
 * 进行项目项目文件转换
 *
 * @param {string} path
 * @return {Object} {path,content}
 */
exports.transformProjectConfig = async function transformProjectConfig(path, context) {
    if (basename(path) !== 'project.config.json') {
        return;
    }
    const projectRules = context.rules.json['project.json'];
    let projectConfig = require(path);
    Object.keys(projectRules).forEach(key => {
        if (projectConfig[key]) {
            const newKey = projectRules[key];
            projectConfig[newKey] = projectConfig[key];
            delete projectConfig[key];
        }
    });
    projectConfig = JSON.stringify(projectConfig, null, 4);
    const newFile = path.replace(basename(path), 'project.swan.json');
    await saveFile(newFile, projectConfig);
};

function isThirdComponents(componentsPath) {
    if (/\/?@baidu\//.test(componentsPath)) {
        return true;
    }
    return false;
}

/**
 * 进行 app.json 文件的转换
 *
 * @param {string} contents 内容
 * @return {Object} 转换好的内容
 */

function transformAppConfig(contents) {
    // subpackages大小写问题，统一为subPackages
    const subPackagesReg = /\bsubpackages$/i;
    const json = isJsonStr(contents) ? JSON.parse(contents) : {};
    const newJson = {};
    Object.keys(json).forEach(keyName => {
        if (subPackagesReg.test(keyName)) {
            newJson['subPackages'] = json[keyName];
            return;
        }
        newJson[keyName] = json[keyName];
    });
    return JSON.stringify(newJson, null, 4);
}

exports.transform = function transform(path, contents, context) {
    const newObj = {};
    newObj.data = {};

    const result = exports.transformEnvConfig(path, contents, context);
    contents = result.contents;

    // TODO app.json和非标json（非componets或pages中的json文件）都不需要做映射校验，仅判断支持不支持即可 @wangpanfe
    const isAppFile = /\bapp\.json$/.test(path);
    const hasUsingComponent = /"usingComponents"/.test(contents);
    if (isAppFile || !hasUsingComponent) {
        // 如果是 app.json，需要做特殊处理
        contents = isAppFile ? transformAppConfig(contents) : contents;
        newObj.contents = contents;
        return newObj;
    }

    const json = isJsonStr(contents) ? JSON.parse(contents) : {};

    const componentRenameMap = {};
    // 为了保留原始的usingComponents中组件定义顺序
    const newUsingComponents = {};
    const parents = contextStore.relationComponentsParent;
    const childs = contextStore.relationComponentsChild;

    let isMatched = true;

    forEach(json.usingComponents, (depsPath, componentName) => {
        // 根据path判断是否为node_modules中的第三方组件库 @wangpanfe
        if (isThirdComponents(depsPath)) {
            depsPath = '/node_modules/' + depsPath;
        }

        // 将驼峰命名法改为使用-连字符 如 MyName => my-name 因为手百不支持驼峰命名法
        if (/[A-Z_]/.test(componentName)) {
            const newName = kebabCase(componentName);
            componentRenameMap[componentName] = newName;
            newUsingComponents[newName] = depsPath;
        } else {
            newUsingComponents[componentName] = depsPath;
        }

        const sliceName = componentName.slice && componentName.slice(2);
        const parentKeys = Object.keys(parents);
        const childKeys = Object.keys(childs);
        const isParent = parentKeys.includes(componentName) || parentKeys.includes(sliceName);
        const isChild = childKeys.includes(componentName) || childKeys.includes(sliceName);
        const pathArr = path.split('/');
        // 使用了依赖组件的上层组件
        const comName = pathArr[pathArr.length - 2];
        const isSame = componentName.indexOf(comName) > -1;

        if (isSame) {
            isMatched = false;
        }
        if ((isParent || isChild) && isMatched) {
            contextStore.dispatch({
                action: 'needSwanIdComponents',
                payload: comName
            });
        }
    });

    json.usingComponents = newUsingComponents;
    newObj.data.componentRenameMap = componentRenameMap;
    // vfile.data.componentRenameMap = componentRenameMap;
    newObj.contents = JSON.stringify(json, null, 4);
    // vfile.contents = JSON.stringify(json, null, 4);
    return newObj;
};


/**
 * 转换 json 中的 env 配置
 *
 * @param {string} contents json文本
 * @param {Object} context 上下文环境
 */
exports.transformEnvConfig = function (path, contents, context) {
    const envConfigKey = `_${context.rules.appType}Env`;
    const ENV_KEY_REGEXP = /^_[swan|wx]+Env$/;
    const newConents = {};

    if (basename(path) === 'project.config.json') {
        return {
            data: {},
            contents
        };
    }

    const json = isJsonStr(contents) ? JSON.parse(contents) : {};

    json && Object.keys(json).forEach(key => {
        if (!ENV_KEY_REGEXP.test(key)) {
            newConents[key] = json[key];
        }
    });

    const envConfig = json[envConfigKey];
    envConfig && Object.keys(envConfig).forEach(key => {
        newConents[key] = envConfig[key];
    });

    const contentsString = JSON.stringify(newConents, null, 4);

    return {
        data: {},
        contents: contentsString
    };
};
