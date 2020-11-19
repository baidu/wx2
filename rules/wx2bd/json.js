/*
 * @Descripttion:
 * @Author: wangpanfe
 * @Date: 2020-03-17 17:01:44
 * @LastEditTime: 2020-03-18 23:45:59
 */
/**
 * @file
 * Created by wangpanfe on 2019/11/25.
 */
'use strict';
const components = require('./component');

module.exports = {
    'app.json': ['prefetches'],
    components,
    'project.json': {
        'miniprogramRoot': 'smartProgramRoot'
    }
};
