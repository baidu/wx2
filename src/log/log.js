/**
 * @file 转换日志
 * @description 记录转换日志相关方法
 */
const utils = require('../util/index');
let instance = null;

class Log {
    constructor(path) {
        if (instance) {
            return instance;
        }
        instance = this;
        this.path = path;
        this.logMsg = {
            info: '',
            warning: '',
            error: ''
        };
        this.lineBreak = utils.isWin() ? '\r\n' : '\r';
    }

    log(action, payload = {}) {
        switch (action) {
            case 'info':
                this.logMsg.info += JSON.stringify(payload) + this.lineBreak;
                break;
            case 'warning':
                this.logMsg.warning += JSON.stringify(payload) + this.lineBreak;
                break;
            case 'error':
                this.logMsg.error += JSON.stringify(payload) + this.lineBreak;
                break;
            default:
                throw new Error('action未定义，行为禁止');
        }
    }

    info(payload) {
        this.log('info', payload);
    }

    warning(payload) {
        this.log('warning', payload);
    }

    error(payload) {
        this.log('error', payload);
    }

    static info(payload) {
        instance.log('info', payload);
    }

    static warning(payload) {
        instance.log('warning', payload);
    }

    static error(payload) {
        instance.log('error', payload);
    }

    static log(action, payload) {
        instance.log(action, payload);
    }

    async dump() {
        const path = this.path;
        ['info', 'warning', 'error'].forEach(level => {
            const logs = this.logMsg[level];
            // main.create(logs, path);
            if (logs !== undefined) {
                utils.saveLog(`${path}/wx2_log/${level}.txt`, logs);
            }
        });

        // 上报互转情况
        let result = {
            state: 'success',
            fileNumber: global.transformFilesLength
        };
        utils.saveLog(`${path}/wx2_log/result.json`, JSON.stringify(result));
    }
}

module.exports = Log;
