/**
 *  @file 针对 var xx = wx全局替换
 */

const {has, get, set} = require('lodash');

module.exports = function ({path, context, file}) {

    let origin = get(context, 'rules.api.currentPrefix');
    let target = get(context, 'rules.api.targetPrefix');
    if (path.node && get(path, 'node.type') === 'VariableDeclaration' && has(path, 'node.declarations')) {
        let declarations = get(path, 'node.declarations');
        declarations.map(item => {
            if (item && item.init && get(item, 'init.name') === origin) {
                set(item, 'init.name', target);
            }
        });
    }

};