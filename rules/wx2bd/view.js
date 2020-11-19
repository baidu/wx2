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
    src: {
        regExp: /\.wxml$/i,
        replace: '.swan'
    },
    data: { // 把data数据添加{}
        regExp: /^{(.*)}$/,
        replace: '{{$1}}'
    },
    script: {
        oldTagName: 'wxs',
        newTagName: 'import-sjs',
        oldFileJsSuffix: 'wxs',
        newFileJsSuffix: 'sjs',
        wxExport: 'module.exports',
        swanExport: 'export default',
        regExp: /module.exports[\s]*=/
    },
    bindData: {
        'scroll-view': ['scroll-top', 'scroll-left', 'scroll-into-view'],
        'input': ['value'],
        'textarea': ['value'],
        'movable-view': ['x', 'y'],
        'slider': ['value']
    },
    bindDataBracket: {
        regExp: /^{{(.*)}}$/,
        replace: '{=$1=}'
    }
};
