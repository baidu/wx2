/**
 * @file 针对 drawImage 参数位置转换
 */
const {has, get, set} = require('lodash');
module.exports = function ({path, context, file}) {
    if (!has(path, 'node.callee.property')) {
        return;
    }
    if (get(path, 'node.callee.name') === 'drawImage') {
        const args = get(path, 'node.arguments');
        if (get(path, 'node.arguments.length') === 9) {
            const first = args.slice(0, 1);
            const argsPrev = args.splice(0, 5).slice(1); // 前五个参数
            // args为后四个参数
            const newArr = first.concat(args, argsPrev);
            set(path, 'node.arguments', newArr);
        }
    }
};
