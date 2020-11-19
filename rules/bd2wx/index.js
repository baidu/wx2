/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';
const api = require('./api');
const view = require('./view');
const css = require('./css');
const js = require('./js');
const json = require('./json');
const component = require('./component');

module.exports = {
    suffixMapping: {
        view: 'wxml',
        css: 'wxss',
        script: 'wxs',
        npm: 'miniprogram_npm'
    },
    api,
    view,
    css,
    js,
    json,
    component
};
