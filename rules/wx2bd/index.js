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
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    suffixMapping: {
        view: 'swan',
        css: 'css',
        script: 'sjs',
        npm: 'node_modules'
    },
    api,
    view,
    css,
    js,
    json,
    component,
    appType: 'swan'
};
