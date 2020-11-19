/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';
const api = require('./api');

module.exports = {
    suffixMapping: {
        view: 'wxml',
        css: 'wxss',
        script: 'wxs',
        npm: 'miniprogram_npm'
    },
    api,
    view: {},
    css: {},
    js: {},
    json: {},
    component: {},
    appType: 'wx'
};
