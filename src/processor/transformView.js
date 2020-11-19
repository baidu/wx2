/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
'use strict';

const isArray = require('lodash/isArray');
const path = require('path');
const unified = require('unified');
const DepGraph = require('dependency-graph').DepGraph;
const {
    getContent, getContentSync, getHtmlParser, saveFile,
    getFiles, toVFile, parse, stringify, wxmlToSwan, envView
} = require('../util/index');
const contextStore = require('../log/store.js');
const {htmlParser, handler} = getHtmlParser();
const {has, get, set} = require('lodash');

/**
 * 转换视图
 *
 * @param {Object} context 转换上下文
 */
exports.transformView = async function (context) {

    const suffix = get(context, 'rules.suffixMapping.view');
    const files = await getFiles(context.dist, suffix);


    // TODO 给view真正转换组件标签时使用 src/view/wxml-to-wx2bd.js
    contextStore.dispatch({
        action: 'renamedComponents',
        payload: getComponentsDeps(files, context)
    });


    await Promise.all(files.map(async file => {
        const content = await getContent(file);
        const result = await exports.transformViewContent(file, content, context);
        await saveFile(file, String(result));
        // 更新进度
        global.emitter.emit('event', false);
    }));
};

/**
 * 构造一个视图文件节点的依赖图
 *
 * @param {Object} tree 视图树
 * @param {DepGraph} graph 视图文件依赖图
 * @param {string} from 视图文件节点
 */
function buildGraph(tree, graph, from) {
    if (!isArray(tree)) {
        const {type, name, attribs, children = []} = tree;
        if (type === 'tag' && (name === 'import' || name === 'include') && attribs.src) {
            let dep = path.resolve(path.dirname(from), attribs.src);
            dep = dep.replace(/\.wxml/, '.swan');
            dep = dep.endsWith('.swan') ? dep : `${dep}.swan`;
            graph.addNode(dep);
            graph.addDependency(from, dep);
        }
        buildGraph(children, graph, from);
        return;
    }
    tree.forEach(node => buildGraph(node, graph, from));
}

/**
 * 转换一个视图文件
 *
 * @param {string} path 文件路径
 * @param {string} contents 文件内容
 * @param {Object} context 上下文
 * @return {Promise.<VFile>}
 */
exports.transformViewContent = function transformViewContent(path, contents, context) {
    const file = toVFile(path, contents, context);
    const isWx2Wx = context.type === context.constant.WECHAT_TO_WECHAT;
    const transform = isWx2Wx ? envView : wxmlToSwan;
    return unified()
        .use(parse)
        .use(transform, context)
        .use(stringify, {context})
        .process(file);
};


/**
 * 构造视图到被修改名称的自定义组件的依赖树
 *
 * @param {Array.<string>} files 视图文件集合
 * @param {Object} context 转化工具上下文
 * @return {Object}
 */
function getComponentsDeps(files, context) {
    // if (context.type === constant.SWAN_TO_WECHAT) return;

    const swanDependencyGraph = files.reduce((graph, file) => {
        graph.addNode(file);
        htmlParser.end(getContentSync(file));
        const tree = handler.dom;
        buildGraph(tree, graph, file);
        htmlParser.reset();
        return graph;
    }, new DepGraph());


    return Object.keys(contextStore.usingComponentsMap || {})
    // 有使用自定义组件、且有不合法自定义组件名称的swan文件，主要包括页面和自定义组件
        .map(key => {
            return key.replace(/\.json$/, '.swan');
        })
        .filter(file => swanDependencyGraph.hasNode(file))
        // 找出页面和自定义组件视图依赖的所有视图
        .map(file => ({
            file: file,
            deps: swanDependencyGraph.dependenciesOf(file)
        }))
        // 找出页面、自定义组件视图以及以上两者使用的视图文件使用的被改名的自定义组件map
        .reduce((prev, {file, deps}) => {
            const jsonFileName = file.replace(/\.swan/, '.json');
            const renamedMap = contextStore.usingComponentsMap[jsonFileName] || {};
            deps.forEach(dep => (prev[dep] = prev[dep] ? {...prev[dep], ...renamedMap} : renamedMap));
            prev[file] = renamedMap;
            return prev;
        }, {});
}
