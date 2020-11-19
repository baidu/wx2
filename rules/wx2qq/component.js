/**
 * @file 自定义组件配置
 * @description 自定义组件不支持的方法
 */
module.exports = {
    // Component构造器中不支持的属性
    Component: {
        moved: null,
        // relations: null,
        observers: null
    },
    // 自定义组件中this上不支持的属性和方法
    this: {
        getRelationNodes: null,
        getTabBar: null,
        getPageId: null,
        selectComponent: {
            // 方法不允许被调用的作用域
            notAllowParents: ['onLaunch', 'onShow', 'onLoad']
        },
        selectAllComponents: {
            // 方法不允许被调用的作用域
            notAllowParents: ['onLaunch', 'onShow', 'onLoad']
        }
    },
    // 设置内置behaviors映射关系
    behaviors: {
        'wx://form-field': {
            mapping: 'swan://form-field'
        },
        'wx://component-export': {
            mapping: 'swan://component-export'
        }
    }
};
