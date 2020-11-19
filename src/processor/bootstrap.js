/**
 * @file
 * Created by wangpanfe on 2019/11/21.
 */
'use strict';

const recursiveCopy = require('recursive-copy');
const {extname} = require('path');
const {getFileType} = require('../util/index');

/**
 * 拷贝文件，及其更换后缀名称
 *
 * @param {Object} context 上下文信息
 */
exports.transformBootstrap = async function (context) {
    const {entry: fromPath, dist: toPath, log, rules} = context;

    await recursiveCopy(fromPath, toPath, {
        overwrite: true,
        expand: true,
        dot: true,
        filter(filePath) {
            return !/(\.idea|\.git|DS_store)/.test(filePath);
        },
        rename(filePath) {
            if (/node_modules/.test(filePath)) {
                return filePath;
            }
            if (/\bminiprogram_npm\b/.test(filePath)) {
                const npmFileName = rules.suffixMapping.npm || 'node_modules';
                filePath = filePath.replace(/\bminiprogram_npm\b/, npmFileName);
                log.warning({
                    time: '[START] bootstrapping - find 『miniprogram_npm』deps',
                    filePath
                });
            }
            const ext = extname(filePath);

            if (!ext) {
                return filePath;
            }

            const fileType = getFileType(filePath);

            if (!fileType) {
                // 更新进度
                global.emitter.emit('event', false);
                return filePath;
            }

            const targetExtname = rules.suffixMapping[fileType];

            if (!targetExtname) {
                return filePath;
            }
            return filePath.replace(ext, '.' + targetExtname);
        }
    });
};
