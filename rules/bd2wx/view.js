/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';

module.exports = {
    boolAttr: [
        's-if',
        's-elif'
    ],

    selfClosingTag2EndTag: ['image'],
    brackets: [
        's-if',
        's-elif',
        's-for'
    ],
    // 映射引入文件路径后缀  xx.wx2bd->xx.wxml
    src: {
        regExp: /\.swan$/i,
        replace: '.wxml'
    },
    data: { // 把data数据添加{}
        regExp: /^{(.*)}$/,
        replace: '$1'
    },
    // 映射filter,sjs,wxs语法
    script: {
        oldTagName: 'import-sjs',
        newTagName: 'wxs',
        oldFileJsSuffix: 'sjs',
        newFileJsSuffix: 'wxs',
        oldExport: 'export default',
        newExport: 'module.exports = ',
        regExp: /export default[\s]*/
    },
    bindData: {
        'scroll-view': ['scroll-top', 'scroll-left', 'scroll-into-view'],
        'input': ['value'],
        'textarea': ['value'],
        'movable-view': ['x', 'y'],
        'slider': ['value']
    },
    bindDataBracket: {
        regExp: /^{=(.*)=}$/,
        replace: '{{$1}}'
    }
};
