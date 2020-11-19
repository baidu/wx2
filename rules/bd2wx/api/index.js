/**
 * @file wx2bd convert wx
 */
const tips = '是个二级API，目前wx还不支持，so sad(ノへ￣、)，需要棒棒的你手动兼容下它和它返回值的api哦 ╮（﹀_﹀）╭ ';

const transformAPI = require('./plugins/member/transformAPI');


/**
 *  action--操作-可选值:tip(提示)、mapping(函数替换)、delete(函数删除)
 *  logLevel--日志级别可选值:info、warning、error
 *  message--日志消息
 *  mapping--替换后的函数名
 */
const defaultConf = {
    action: 'tip',
    logLevel: 'warning',
    mapping: '',
    message: ''
};
const defaultDeleteConf = {
    action: 'delete',
    logLevel: 'error',
    message: '没有相对应的函数'
};
module.exports = {
    currentPrefix: 'swan',
    targetPrefix: 'wx',
    API: {
        navigateToSmartProgram: {
            action: 'map',
            logLevel: 'info',
            mapping: 'navigateToMiniProgram',
            message: '方法被替换为navigateToMiniProgram'
        },
        navigateBackSmartProgram: {
            action: 'map',
            logLevel: 'info',
            mapping: 'navigateBackMiniProgram',
            message: '方法被替换为navigateBackMiniProgram'
        },
        requestPolymerPayment: {
            action: 'tip',
            logLevel: 'error',
            message: '存在diff的函数，微信小程序中需使用requestPayment替代 \n      相关文档：https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1'
        },
        onURLQueryChange: defaultDeleteConf,
        getURLQuery: defaultDeleteConf,
        setURLQuery: defaultDeleteConf,
        ai: defaultDeleteConf,
        createARCameraContext: defaultDeleteConf,
        showFavoriteGuide: defaultDeleteConf,
        getEnvInfoSync: defaultDeleteConf,
        getNetworkType: defaultDeleteConf,
        getunionid: defaultDeleteConf,
        isLoginSync: defaultDeleteConf,
        getSwanId: defaultDeleteConf,
        openCommunityEditor: defaultDeleteConf,
        openReplyEditor: defaultDeleteConf,
        closeReplyEditor: defaultDeleteConf,
        navigateToSmartProgram: defaultDeleteConf,
        getSystemRiskInfo: defaultDeleteConf,
        onForceReLaunch: defaultDeleteConf,
        getTTSManager: defaultDeleteConf,
        openWalkNavigation: defaultDeleteConf,
        ai: defaultDeleteConf,
        deleteEventOnCalendar: defaultDeleteConf,
        setMenuEnabled: defaultDeleteConf,
        addEventOnCalendar: defaultDeleteConf,
        setMenuEnabled: defaultDeleteConf,
        getCommonSysInfo: defaultDeleteConf,
        getPhoneContacts: defaultDeleteConf,
        openShare: defaultDeleteConf,
        openAppByURL: defaultDeleteConf,
        createAppInstallManager: defaultDeleteConf,
        createAdAppInstallManager: defaultDeleteConf,
        openBdboxWebview: defaultDeleteConf,
        openAdWebPage: defaultDeleteConf,
        multiAuthorize: defaultDeleteConf,
        faceVerify: defaultDeleteConf,
        getRealNameInfo: defaultDeleteConf,
        getPhoneNumber: defaultDeleteConf,
        getPushSettingStateSync: defaultDeleteConf,
        guidePushSetting: defaultDeleteConf,
        getBDUSS: defaultDeleteConf,
        getStoken: defaultDeleteConf,
        thirdPartyLogin: defaultDeleteConf,
        requestPayment: defaultDeleteConf,
        requestAliPayment: defaultDeleteConf,
        requestWalletPolymerPayment: defaultDeleteConf,
        navigateToSmartProgram: defaultDeleteConf,
        recommendSimilarProducts: defaultDeleteConf,
        showOpenAppGuide: defaultDeleteConf,
        faceResultVerify: defaultDeleteConf,
        getChannelID: defaultDeleteConf,
        getWalletRiskControlData: defaultDeleteConf,
        invokeSecurityMethod: defaultDeleteConf,
        exit: defaultDeleteConf,
        confirmAppClose: defaultDeleteConf,
        adRequest: defaultDeleteConf,
        getHistory: defaultDeleteConf,
        deleteHistory: defaultDeleteConf,
        getFollowStatus: defaultDeleteConf,
        follow: defaultDeleteConf,
        register: defaultDeleteConf,
        unRegister: defaultDeleteConf,
        pullMessage: defaultDeleteConf,
        sendBroadcast: defaultDeleteConf,
        addFavor: defaultDeleteConf,
        getFavor: defaultDeleteConf,
        deleteFavor: defaultDeleteConf,
        setTopFavor: defaultDeleteConf,
        checkFavor: defaultDeleteConf,
        launchCloudGame: defaultDeleteConf,
        getPayStatus: defaultDeleteConf,
        addCard: defaultDeleteConf,
        getCardList: defaultDeleteConf,
        createActivityContext: defaultDeleteConf,
        createFullScreenView: defaultDeleteConf,
        ubcReporter: defaultDeleteConf,
        webView: defaultDeleteConf,
        setSelectedAddressSync: defaultDeleteConf,
        sendBroadcase: defaultDeleteConf,
        postGameCenterMessage: defaultDeleteConf
    },
    babel: {
        MemberExpression: [transformAPI],
        CallExpression: [],
        ObjectProperty: [],
        StringLiteral: [],
        ExpressionStatement: [],
        ObjectMethod: []
    }
};
