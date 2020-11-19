/* eslint-disable */
'use strict';

const {kebabCase, isArray} = require('lodash');
const path = require('path');
const regexgen = require('regexgen');
const utils = require('../index');
const SWAN_ID_FOR_SYSTEM = 'swanIdForSystem';
const constant = require('../../config/constant');
const transformEnvView = require('./env-view');
let componentUniqueFlag = (Math.random() + '').slice(2);
let componentsSwanIdMap = {};

module.exports = function (context = {}) {
    let viewRules;
    try {
        // todo: 多一层的嵌套
        viewRules = context.rules;
    } catch (error) {
        throw new Error('Missing view transformation configuration project')
    }

    return function transformTree(tree, file) {
        if (isArray(tree)) {
            return tree.map(node => transformTree(node, file));
        }
        if (tree.type === 'tag') {
            const {name, attribs, children} = tree;

            if (name === 'import' || name === 'include') {
                tree = tranformImport(tree, file, viewRules);
            }

            // template data属性的值需要包一层花括号
            if (name === 'template') {
                tree = tranformTemplate(tree, file, viewRules);
            }

            // input标签强制自闭合
            if (name === 'input') {
                tree = tranformInput(tree, file, viewRules);
            }

            tree = tranformBindData(tree, file, viewRules);

            tree = transformWXS(tree, file, viewRules);

            tree = transformComponent(tree, file, context);

            tree.children = children.map(node => transformTree(node, file));

            tree = transformDirective(tree, file, context);

            // 无请求头的css静态资源url添加https请求头
            tree = transformStyle(tree, file, context);

            // 一定要在transform children和transformDirective之后
            const transformedAttribs = tree.attribs;
            if (transformedAttribs['s-for'] && transformedAttribs['s-if']) {
                tree = transformForIFDirective(tree, file, context);
            }
            tree = transformEnvView(context)(tree, file);
        }
        return tree;
    }
};

/**
 * 转换import和include标签
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} viewRules 转换配置
 * @return {Object}
 */
function tranformImport(node, file, viewRules) {
    let {regExp, replace} = viewRules.view.src;
    const attribs = node.attribs;
    if (attribs && attribs.src) {
        let src = attribs.src.replace(regExp, replace);
        // src中没有扩展名的添加默认扩展名.wx2bd
        if (!/\w+\.\w+$/.test(src)) {
            src = src + replace;
        }
        return {
            ...node,
            attribs: {
                ...attribs,
                src: src
            }
        };
    }
    return node;
}

/**
 * 转换WXS为sjs
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} viewRules 转换配置
 * @return {Object}
 */
function transformWXS(node, file, viewRules) {
    const {oldTagName, newTagName, oldExport, newExport, regExp, oldFileJsSuffix, newFileJsSuffix} = viewRules.view.script;

    if (node.name === oldTagName) {
        node.name = newTagName;
        if (node.attribs.src && node.attribs.src.indexOf(oldFileJsSuffix) > -1) {
            node.attribs.src = node.attribs.src.replace(eval(`/.${oldFileJsSuffix}$/`), `.${newFileJsSuffix}`);
        } else {
            //TODO SJS好像是支持 module.exports导出的，没必要转换
            let data = node.children[0] && node.children[0].data;
            if (typeof data === 'string' && data.indexOf(oldExport) > -1) {
                node.children[0].data = data.replace(regExp, newExport);
            }
        }
    }

    return node;
}

/**
 * 转换模板标签
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} viewRules 转换配置
 * @return {Object}
 */
function tranformTemplate(node, file, viewRules) {
    const attribs = node.attribs;
    const {regExp, replace} = viewRules.view.data;
    if (!attribs) {
        return node;
    }
    let newAttribs = attribs;
    // let hasBracket = hasBrackets(attribs.is);
    // if (attribs.is) {
    //     // 换成 - 链接
    //     if (hasBracket) {
    //         attribs.is = dropBrackets(attribs.is);
    //     }
    //
    //     const start = attribs.is.indexOf('?');
    //     const end = attribs.is.indexOf(':');
    //     let startValue = '';
    //     let endValue = '';
    //     let startValueNew = '';
    //     let endValueNew = '';
    //     let newName = '';
    //     if (start > -1 && end > -1) {
    //         startValue = attribs.is.slice(start + 1, end);
    //         endValue = attribs.is.slice(end + 1);
    //         startValueNew = kebabCase(startValue);
    //         endValueNew = kebabCase(endValue);
    //         newName = attribs.is.replace(startValue, `'${startValueNew}'`).replace(endValue, `'${endValueNew}'`);
    //     } else {
    //         newName = kebabCase(attribs.is);
    //     }
    //
    //     newAttribs = {...attribs, is: hasBracket ? `{{${newName}}}` : newName};
    // }

    //  暂不处理驼峰
    // if (attribs.name) {
    //     newAttribs = {...newAttribs, name: kebabCase(attribs.name)};
    // }

    if (attribs.data) {
        let data = attribs.data.replace(regExp, replace);
        newAttribs = {...newAttribs, data};
    }

    return {
        ...node,
        attribs: {...newAttribs}
    };
}

/**
 * 转换input标签
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 转换配置
 * @return {Object}
 */
function tranformInput(node, file, context) {
    if (!node.selfclose) {
        file.message('remove input close tag');
        return {
            ...node,
            selfclose: true
        };
    }
    return node;
}

/**
 * 转换自定义组件
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 转换配置
 * @return {Object}
 */
function transformComponent(node, file, context) {
    //勿动！改动前，和xujie商量下
    let Store = context.Store;
    const filePath = path.resolve(file.cwd, file.dirname, file.basename);
    const renamedComponents = Store.renamedComponents || {};
    const renamedComponentMap = renamedComponents[filePath];

    const relationComponentsParent = Store.relationComponentsParent;
    const relationComponentsChild = Store.relationComponentsChild;
    const needSwanIdComponents = Store.needSwanIdComponents;

    const attribs = node.attribs;
    let addNodeAttrib = {};
    let name = node.name;


    Object.keys(relationComponentsParent).forEach(componentKey => {
        if (componentKey === name || componentKey === (name.slice && name.slice(2))) {
            if (attribs.id) {
                context.log.warning({
                    type: 'swan中的id属性被替换',
                    file: file,
                    name
                })
            }

            componentUniqueFlag = (Math.random() + '').slice(2);
            //获取依赖数组的第一个元素
            const attribSystem = relationComponentsParent[componentKey][0] + '-' + componentUniqueFlag;
            addNodeAttrib[SWAN_ID_FOR_SYSTEM] = componentUniqueFlag;
            addNodeAttrib.id = componentKey + '-' + componentUniqueFlag;

            componentsSwanIdMap[componentKey] = componentUniqueFlag;

        }
    });
    Object.keys(relationComponentsChild).forEach(componentKey => {
        if (componentKey === name || componentKey === (name.slice && name.slice(2))) {
            const parentKey = relationComponentsChild[componentKey][0];
            const attribSystem = componentKey + '-' + componentsSwanIdMap[parentKey];
            addNodeAttrib[SWAN_ID_FOR_SYSTEM] = componentsSwanIdMap[parentKey] || componentUniqueFlag;
            addNodeAttrib.class = attribs.class ? attribs.class + ' ' + attribSystem : attribSystem;
        }
    });

    if (typeof name === 'string' && /u-grid/i.test(name)) {
        addNodeAttrib.length = '{{actions.length || 2}}';
    }

    const pathArr = filePath.split('/');
    //使用了依赖组件的上层组件
    const dirName = pathArr[pathArr.length - 2];
    if (needSwanIdComponents.includes(dirName) && addNodeAttrib[SWAN_ID_FOR_SYSTEM]) {
        addNodeAttrib[SWAN_ID_FOR_SYSTEM] = `{{${SWAN_ID_FOR_SYSTEM}}}`;
        if (addNodeAttrib.id) {
            addNodeAttrib.id = `{{${SWAN_ID_FOR_SYSTEM}}}`;
        }
        if (addNodeAttrib.class) {
            addNodeAttrib.class = addNodeAttrib.class.replace(/\d{8,}/, `{{${SWAN_ID_FOR_SYSTEM}}}`);
        }
    }

    //给上层组件增加透传的swanId属性，例如modal
    if (needSwanIdComponents.includes(name) || needSwanIdComponents.includes(name.slice && name.slice(2))) {
        addNodeAttrib[SWAN_ID_FOR_SYSTEM] = componentUniqueFlag;
        componentUniqueFlag = (Math.random() + '').slice(2);
    }

    if (renamedComponentMap && renamedComponentMap[name]) {
        name = renamedComponentMap[name];

        context.log.warning({
            type: '组件名称被替换',
            file: file,
            name: node.name
        })
    }

    return {
        ...node,
        name,
        attribs: {...addNodeAttrib, ...attribs}
    };
}

/**
 * 转换标签上的directive
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 转换配置
 * @return {Object}
 */
function transformDirective(node, file, context) {
    const {attribs, singleQuoteAttribs = {}} = node;
    if (!attribs) {
        return node;
    }

    if (context.type === constant.SWAN_TO_WECHAT) {
        const newAttribs = Object
            .keys(attribs)
            .reduce((newAttribs, attrKey) => {
                if (attrKey.indexOf('s-for') > -1 && attribs[attrKey].indexOf(' in ') > -1) {
                    attribs[attrKey] = attribs[attrKey].trim();
                    const [value, key] = attribs[attrKey].split(' in ')[0].split(',');
                    const forValue = attribs[attrKey].split(' in ')[1];

                    if (key) newAttribs['wx:for-index'] = key.trim();
                    newAttribs['wx:for-item'] = value.trim();
                    newAttribs['wx:for'] = `{{${forValue}}}`;
                    return newAttribs;
                }

                if (attrKey.indexOf('s-for') > -1 && attribs[attrKey].indexOf('trackBy') > -1) {
                    context.log.warning({
                        type: 'trackBy属性被移除',
                        file: file,
                        name: node.name
                    });
                    return newAttribs
                }

                let newValue = attribs[attrKey];
                if (['s-for', 's-if', 's-elif'].includes(attrKey)) {
                    newValue = `{{${attribs[attrKey]}}}`;
                }

                let newKey = attrKey.replace(/^s-/, 'wx:');
                newAttribs[newKey] = newValue;
                return newAttribs;
            }, {});
        return {
            ...node,
            attribs: newAttribs,
            singleQuoteAttribs: Object
                .keys(singleQuoteAttribs)
                .reduce(
                    (prev, key) => {
                        const newKey = key.replace(/^s-/, 'wx:');
                        return {
                            ...prev,
                            [newKey]: singleQuoteAttribs[key]
                        };
                    },
                    {}
                )
        };
    }

    const newAttribs = Object
        .keys(attribs)
        .reduce(
            (newAttribs, key) => {
                // 舍弃
                if (['wx:for-index', 'wx:for-item'].includes(key)) {

                    return newAttribs;
                }

                let newKey = key.replace(/^wx:$/, '').replace(/^wx[:\-]/, 's-');
                const value = attribs[key];
                let newValue = value;
                // 去除花括号
                if (['wx:for', 'wx:for-items', 'wx:for-item', 'wx:if', 'wx:elif'].includes(key)) {
                    newValue = dropBrackets(value);
                }
                // 合并wx:for wx:for-items wx:for-item wx:for-index
                if (key === 'wx:for' || key === 'wx:for-items') {
                    newKey = 's-for';
                    const item = attribs['wx:for-item'] || 'item';
                    const index = attribs['wx:for-index'] || 'index';
                    if (newValue.indexOf(' in ') > -1) {
                        newValue = newValue.split(' in ')[1].trim();
                    }
                    if (typeof +newValue === "number" && !isNaN(+newValue)) {
                        let array = +newValue;
                        newValue = [];
                        for (let i = 0; i < array; i++) {
                            newValue.push(i + 1);
                        }
                    }
                    newValue = `${item}, ${index} in ${newValue}`;
                }

                newAttribs[newKey] = newValue;
                return newAttribs;
            },
            {}
        );
    return {
        ...node,
        attribs: newAttribs,
        singleQuoteAttribs: Object
            .keys(singleQuoteAttribs)
            .reduce(
                (prev, key) => {
                    const newKey = key.replace(/^wx:/, 's-');
                    return {
                        ...prev,
                        [newKey]: singleQuoteAttribs[key]
                    };
                },
                {}
            )
    };
}

/**
 * 判断是否{{}}数据绑定
 *
 * @param {string} value 属性值
 * @return {boolean}
 */
function hasBrackets(value = '') {
    const trimed = value.trim();
    return /^{{.*}}$/.test(trimed);
}

/**
 * 丢掉属性值两侧的花括号
 *
 * @param {string} value 属性值
 * @return {string}
 */
function dropBrackets(value = '') {
    const trimed = value.trim();
    if (/^{{.*}}$/.test(trimed)) {
        return trimed.slice(2, -2).trim();
    }
    return value;
}

/**
 * 转换标签上的for if directive
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 转换配置
 * @return {Object}
 */
function transformForIFDirective(node, file, context) {
    const {attribs, children} = node;
    const ifValue = attribs['s-if'];
    const forValue = attribs['s-for'];
    const [forItemName, forIndexName] = forValue.slice(0, forValue.indexOf(' in ')).split(',');

    const forItemNameRegex = getVariableRegex(forItemName);
    const forIndexNameRegex = getVariableRegex(forIndexName);

    const shouldBeAfterFor = forItemNameRegex.test(ifValue) || forIndexNameRegex.test(ifValue);
    if (shouldBeAfterFor) {
        const blockNode = {
            type: 'tag',
            name: 'block',
            attribs: {
                's-if': ifValue
            },
            children: children,
            parent: node
        };
        delete node.attribs['s-if'];
        node.children = [blockNode];
        blockNode.children = blockNode.children.map(item => ({
            ...item,
            parent: blockNode
        }));
    }
    return node;
}

/**
 * 生成匹配变量名的正则表达式
 *
 * @param {string} variable 变量名
 * @return {RegExp}
 */
function getVariableRegex(variable) {
    if (variable[0] === '$') {
        const regex = regexgen([variable.slice(1)]);
        return new RegExp(`\\$${regex.toString().slice(1, -1)}\\b`);
    }
    const regex = regexgen([variable]);
    return new RegExp(`\\b${regex.toString().slice(1, -1)}\\b`);
}

/**
 * 转换数据绑定为双向绑定语法
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} viewRules 转换配置
 * @return {Object}
 */
function tranformBindData(node, file, viewRules) {
    const dataBindConf = viewRules.view.bindData;
    const tranformBindDataList = dataBindConf[node.name];
    const {regExp, replace} = viewRules.view.bindDataBracket;
    if (!tranformBindDataList) {
        return node;
    }

    const attribs = node.attribs;
    tranformBindDataList.forEach(attr => {
        if (attribs && attribs[attr]) {
            if (hasBrackets(attribs[attr])) {
                // node.attribs[attr] = `{=${dropBrackets(attribs[attr])}=}`;
                node.attribs[attr] = node.attribs[attr].replace(regExp, replace);
            } else {
                node.attribs[attr] = `${attribs[attr]}`;
            }
        }
    });
    return node;
}

/**
 * 转换style
 * 无请求头的css静态资源url添加https请求头
 *
 * @param {Object} node 节点对象
 * @param {VFile} file 虚拟文件
 * @param {Object} context 转换配置
 * @return {Object}
 */
function transformStyle(node, file, context) {
    const attribs = node.attribs;
    if (attribs.style) {
        attribs.style = utils.transformCssStaticUrl(attribs.style);
    }
    return node;
}
