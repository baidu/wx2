/**
 * @file 自定义组件配置
 * @description 自定义组件不支持的方法
 */
module.exports = {
    // Component构造器中不支持的属性
    Component: {
    },
    // 自定义组件中this上不支持的属性和方法
    this: {

    },
    // 设置内置behaviors映射关系
    behaviors: {
        'swan://form-field': {
            mapping: 'wx://form-field'
        },
        'swan://component-export': {
            mapping: 'wx://component-export'
        }
    },
    json: {

    }
};
