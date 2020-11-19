

/**
 * @file wxml convert wx2bd
 */

const tips = '是个二级API，目前swan还不支持，so sad(ノへ￣、)，需要棒棒的你手动兼容下它和它返回值的api哦 ╮（﹀_﹀）╭ ';

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
    message: '没有相对应的函数',
    customFunction: null
};
module.exports = {
    currentPrefix: 'wx',
    targetPrefix: 'swan',
    API: {
        // -------------------------------------基础-------------------------------------
        // 环境变量
        env: defaultDeleteConf,
        // -------------------------------------媒体-------------------------------------
        // 录音
        startRecord: defaultDeleteConf,
        stopRecord: defaultDeleteConf,
        // 音频
        stopVoice: defaultDeleteConf,
        playVoice: defaultDeleteConf,
        pauseVoice: defaultDeleteConf,
        createAudioContext: {
            ...defaultConf,
            message: tips
        },
        // 背景音频
        stopBackgroundAudio: defaultDeleteConf,
        seekBackgroundAudio: defaultDeleteConf,
        playBackgroundAudio: defaultDeleteConf,
        pauseBackgroundAudio: defaultDeleteConf,
        onBackgroundAudioStop: defaultDeleteConf,
        onBackgroundAudioPlay: defaultDeleteConf,
        onBackgroundAudioPause: defaultDeleteConf,
        getBackgroundAudioPlayerState: defaultDeleteConf,
        // 实时音视频
        createLivePusherContext: {
            ...defaultConf,
            message: tips
        },
        createLivePlayerContext: {
            ...defaultConf,
            message: tips
        },
        // 音视频合成
        createMediaContainer: defaultDeleteConf,
        // 图片
        chooseMessageFile: defaultDeleteConf,
        // -------------------------------------设备-------------------------------------
        // 蓝牙
        openBluetoothAdapter: defaultDeleteConf,
        closeBluetoothAdapter: defaultDeleteConf,
        getBluetoothAdapterState: defaultDeleteConf,
        onBluetoothAdapterStateChange: defaultDeleteConf,
        startBluetoothDevicesDiscovery: defaultDeleteConf,
        getBluetoothDevices: defaultDeleteConf,
        getConnectedBluetoothDevices: defaultDeleteConf,
        onBluetoothDeviceFound: defaultDeleteConf,
        // 低功耗蓝牙
        createBLEConnection: defaultDeleteConf,
        closeBLEConnection: defaultDeleteConf,
        getBLEDeviceServices: defaultDeleteConf,
        getBLEDeviceCharacteristics: defaultDeleteConf,
        writeBLECharacteristicValue: defaultDeleteConf,
        notifyBLECharacteristicValueChange: defaultDeleteConf,
        onBLEConnectionStateChange: defaultDeleteConf,
        offBLECharacteristicValueChange: defaultDeleteConf,
        offBLEPeripheralConnectionStateChanged: defaultDeleteConf,
        onBLECharacteristicValueChange: defaultDeleteConf,
        onBLEConnectionStateChange: defaultDeleteConf,
        // iBeacon
        startBeaconDiscovery: defaultDeleteConf,
        getBeacons: defaultDeleteConf,
        onBeaconUpdate: defaultDeleteConf,
        onBeaconServiceChange: defaultDeleteConf,
        IBeaconInfo: defaultDeleteConf,
        offBeaconServiceChange: defaultDeleteConf,
        startBeaconDiscovery: defaultDeleteConf,
        // NFC
        getHCEState: defaultDeleteConf,
        startHCE: defaultDeleteConf,
        stopHCE: defaultDeleteConf,
        onHCEMessage: defaultDeleteConf,
        sendHCEMessage: defaultDeleteConf,
        offHCEMessage: defaultDeleteConf,
        // WI-FI
        startWifi: defaultDeleteConf,
        stopWifi: defaultDeleteConf,
        connectWifi: defaultDeleteConf,
        getWifiList: defaultDeleteConf,
        onGetWifiList: defaultDeleteConf,
        setWifiList: defaultDeleteConf,
        onWifiConnected: defaultDeleteConf,
        getConnectedWifi: defaultDeleteConf,
        offWifiConnected: defaultDeleteConf,
        offGetWifiList: defaultDeleteConf,
        // 罗盘
        offCompassChange: defaultDeleteConf,
        // 陀螺仪
        startGyroscope: defaultDeleteConf,
        // -------------------------------------界面-------------------------------------
        // 置顶
        setTopBarText: defaultDeleteConf,
        // 字体
        loadFontFace: defaultDeleteConf,
        // 键盘
        getSelectedTextRange: defaultDeleteConf,
        // -------------------------------------画布-------------------------------------
        createOffscreenCanvas: defaultDeleteConf,
        createContext: {
            ...defaultDeleteConf,
            message: '被废弃的函数，建议使用createCanvasContext替代'
        },
        drawCanvas: {
            ...defaultDeleteConf,
            message: '被废弃的函数，建议使用createCanvasContext替代'
        },
        Image: defaultDeleteConf,
        ImageData: defaultDeleteConf,
        // -------------------------------------转发-------------------------------------
        showShareMenu: defaultDeleteConf,
        hideShareMenu: defaultDeleteConf,
        updateShareMenu: defaultDeleteConf,
        getShareInfo: defaultDeleteConf,
        // -------------------------------------开放接口-------------------------------------
        // 卡券
        addCard: defaultDeleteConf,
        openCard: defaultDeleteConf,
        // 微信运动
        getWeRunData: defaultDeleteConf,
        // 小程序跳转
        navigateToMiniProgram: {
            action: 'map',
            logLevel: 'info',
            mapping: 'navigateToSmartProgram',
            message: '方法被替换为navigateToSmartProgram'
        },
        navigateBackMiniProgram: {
            action: 'map',
            logLevel: 'info',
            mapping: 'navigateBackSmartProgram',
            message: '方法被替换为navigateBackSmartProgram'
        },
        // 生物认证
        checkIsSupportSoterAuthentication: defaultDeleteConf,
        startSoterAuthentication: defaultDeleteConf,
        checkIsSoterEnrolledInDevice: defaultDeleteConf,
        // 支付
        requestPayment: {
            action: 'tip',
            logLevel: 'error',
            message: '存在diff的函数，百度小程序中需使用requestPolymerPayment替代 \n      相关文档：https://smartprogram.baidu.com/docs/develop/api/open_payment/'
        },
        // -------------------------------------广告-------------------------------------
        createRewardedVideoAd: defaultDeleteConf,
        createInterstitialAd: defaultDeleteConf,
        // -------------------------------------网络-------------------------------------
        // UDP通信
        createUDPSocket: defaultDeleteConf,
        // mDNS
        offLocalServiceDiscoveryStop: defaultDeleteConf,
        offLocalServiceLost: defaultDeleteConf,
        onLocalServiceFound: defaultDeleteConf,
        onLocalServiceLost: defaultDeleteConf,
        startLocalServiceDiscovery: defaultDeleteConf,
        stopLocalServiceDiscovery: defaultDeleteConf,
        // -------------------------------------Worker-------------------------------------
        createWorker: defaultDeleteConf,
        // -------------------------------------数据缓存-------------------------------------
        onBackgroundFetchData: defaultDeleteConf,
        setBackgroundFetchToken: defaultDeleteConf
    }
};

