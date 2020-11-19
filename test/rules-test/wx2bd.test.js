/**
 * @file wx2bd
 * @description wx2bd的测试
 */

const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
const babylon = require('@babel/parser');
const generate = require('@babel/generator').default;
const constant = require('../../src/config/constant');
const utils = require('../../src/util/index');
const Log = require('../../src/log/log');
const Store = require('../../src/log/store');
const parseView = require('../../src/util/view/parse');
const stringifyView = require('../../src/util/view/stringify');
const unified = require('unified');
const transform = require('../../src/index');
const logInstance = new Log('../../src/log');

const distName = `output-${constant.WECHAT_TO_SWAN}`;
const resultName = `result-${constant.WECHAT_TO_SWAN}`;

const distPath = path.resolve(__dirname, `../output/${distName}`);
const entryPath = path.resolve(__dirname, '../source');
const resultPath = path.resolve(__dirname, `../result/${resultName}`);
const rules = require(`../../rules/${constant.WECHAT_TO_SWAN}/index.js`);

const CONTEXT = {
    type: constant.WECHAT_TO_SWAN,
    status: 'TRANSFORM_WAIT',
    constant,
    entry: entryPath,
    dist: distPath,
    rules,
    log: logInstance,
    Store,
    data: {}
};

const options = {
    entry: entryPath,
    dist: distPath,
    logFor: distPath,
    target: 'bd'
};

const replacePathReg = new RegExp(resultPath);

function getViewTree(content, context) {
    const tree = unified()
        .use(parseView, context)
        .parse(content);
    return unified()
        .use(stringifyView, {context})
        .stringify(tree);
}

beforeAll(async () => {
    await transform(options);
});

describe('wx2bd: test createTransformInfo: ', () => {
    const distInfoPath = path.resolve(distPath, '.wx2info');
    test('.wx2info', () => {
        fs.stat(distInfoPath, (err, stats) => {
            expect(stats && stats.isFile()).toBe(true);
        });
    });
});

describe('wx2bd: test transform wxss: ', () => {
    const files = glob.sync(`${resultPath}/**/*.wxss`);
    files.forEach(file => {
        test(file, () => {
            const resultContent = utils.getContentSync(file);
            const distContent = utils.getContentSync(file.replace(replacePathReg, distPath));
            expect(resultContent).toBe(distContent);
        });
    });
});

describe('wx2bd: test transform config: ', () => {
    const files = glob.sync(`${resultPath}/**/*.json`);
    files.forEach(file => {
        test(file, () => {
            const resultContent = utils.getContentSync(file);
            const distContent = utils.getContentSync(file.replace(replacePathReg, distPath));
            expect(resultContent).toBe(distContent);
        });
    });
});

describe('wx2bd: test transform view: ', () => {
    const files = glob.sync(`${resultPath}/**/*.wxml`);
    files.forEach(file => {
        test(file, () => {
            const resultContent = utils.getContentSync(file);
            const distContent = utils.getContentSync(file.replace(replacePathReg, distPath));
            // 忽略掉空格的影响
            const resultTreeContent = getViewTree(resultContent, CONTEXT).replace(/\s/g, '');
            const distTreeContent = getViewTree(distContent, CONTEXT).replace(/\s/g, '');
            expect(resultTreeContent).toBe(distTreeContent);
        });
    });
});

describe('wx2bd: test transform api: ', () => {
    const files = glob.sync(`${resultPath}/**/*.js`);
    files.forEach(file => {
        test(file, () => {
            const resultContent = babylon.parse(utils.getContentSync(file), {sourceType: 'module'});
            const distContent = babylon.parse(
                utils.getContentSync(file.replace(replacePathReg, distPath)),
                {sourceType: 'module'}
            );
            const resultCode = generate(resultContent, {compact: true}).code;
            const distCode = generate(distContent, {compact: true}).code;
            expect(resultCode).toBe(distCode);
        });
    });
});


describe('wx2bd: test transform js: ', () => {
    const files = glob.sync(`${resultPath}/**/*.wxs`);
    files.forEach(file => {
        test(file, () => {
            const resultContent = utils.getContentSync(file);
            const distContent = utils.getContentSync(file.replace(replacePathReg, distPath).replace(/\.wxss/, '.css'));
            expect(resultContent).toBe(distContent);
        });
    });
});
