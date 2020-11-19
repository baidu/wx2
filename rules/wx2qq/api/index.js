/**
 * @file wxml convert wx2bd
 */
const transformAPI = require('./plugins/member/transformAPI');

/**
 *  action--操作-可选值:tip(提示)、mapping(函数替换)、delete(函数删除)
 *  logLevel--日志级别可选值:info、warning、error
 *  message--日志消息
 *  mapping--替换后的函数名
 */
const defaultDeleteConf = {
    action: 'delete',
    logLevel: 'error',
    message: '没有相对应的函数'
};
const willSupprtConf = {
    action: 'delete',
    logLevel: 'error',
    message: 'QQ暂不支持，后续会更新'
};
const deleteObjConf = {
    action: 'delete',
    logLevel: 'error',
    message: '没有相对应的对象'
};
const DeleteArgConf = {
    action: 'delete',
    logLevel: 'error',
    message: '没有相对应的参数'
};
module.exports = {
    currentPrefix: 'wx',
    targetPrefix: 'qq',
    wx: {
        base65ToArrayBuffer: defaultDeleteConf,
        arrayBufferToBase65: defaultDeleteConf,
        getRealtimeLogManager: defaultDeleteConf,
        getRealtimeLogManager: defaultDeleteConf,
        hideHomeButton: defaultDeleteConf,
        setTopBarText: defaultDeleteConf,
        getSelectedTextRange: defaultDeleteConf,
        connectSocket: defaultDeleteConf,
        setBackgroundFetchToken: defaultDeleteConf,
        onBackgroundFetchData: defaultDeleteConf,
        getBackgroundFetchData: defaultDeleteConf,
        getBackgroundFetchToken: defaultDeleteConf,
        compressImage: defaultDeleteConf,
        stopVoice: defaultDeleteConf,
        playVoice: defaultDeleteConf,
        pauseVoice: defaultDeleteConf,
        createAudioContext: defaultDeleteConf,
        stopBackgroundAudio: defaultDeleteConf,
        seekBackgroundAudio: defaultDeleteConf,
        playBackgroundAudio: defaultDeleteConf,
        pauseBackgroundAudio: defaultDeleteConf,
        onBackgroundAudioStop: defaultDeleteConf,
        onBackgroundAudioPlay: defaultDeleteConf,
        onBackgroundAudioPause: defaultDeleteConf,
        getBackgroundAudioPlayerState: defaultDeleteConf,
        stopRecord: defaultDeleteConf,
        startRecord: defaultDeleteConf,
        createMediaContainer: defaultDeleteConf,
        stopLocationUpdate: defaultDeleteConf,
        startLocationUpdateBackground: defaultDeleteConf,
        startLocationUpdate: defaultDeleteConf,
        onLocationChange: defaultDeleteConf,
        offLocationChange: defaultDeleteConf,
        createOffscreenCanvas: defaultDeleteConf,
        chooseAddress: defaultDeleteConf,
        openCard: defaultDeleteConf,
        addCard: defaultDeleteConf,
        requestSubscribeMessage: defaultDeleteConf,
        offNetworkStatusChange: defaultDeleteConf,
        offUserCaptureScreen: defaultDeleteConf,
        offAccelerometerChange: defaultDeleteConf,
        offCompassChange: defaultDeleteConf,
        offDeviceMotionChange: defaultDeleteConf,
        offGyroscopeChange: defaultDeleteConf,
        offMemoryWarning: defaultDeleteConf,
        createRewardedVideoAd: defaultDeleteConf,
        playbackRate: defaultDeleteConf,
        onCameraFrame: defaultDeleteConf,
        createImageData: defaultDeleteConf,
        node: defaultDeleteConf,
        destroy: defaultDeleteConf,

        loadFontFace: willSupprtConf,
        openLocation: willSupprtConf,
        chooseLocation: willSupprtConf,
        chooseInvoiceTitle: willSupprtConf,
        startSoterAuthentication: willSupprtConf,
        checkIsSupportSoterAuthentication: willSupprtConf,
        chooseInvoice: willSupprtConf,
        checkIsSoterEnrolledInDevice: willSupprtConf,
        stopBeaconDiscovery: willSupprtConf,
        startBeaconDiscovery: willSupprtConf,
        onBeaconUpdate: willSupprtConf,
        onBeaconServiceChange: willSupprtConf,
        offBeaconUpdate: willSupprtConf,
        offBeaconServiceChange: willSupprtConf,
        getBeacons: willSupprtConf,
        stopWifi: willSupprtConf,
        startWifi: willSupprtConf,
        setWifiList: willSupprtConf,
        onWifiConnected: willSupprtConf,
        onGetWifiList: willSupprtConf,
        offWifiConnected: willSupprtConf,
        offGetWifiList: willSupprtConf,
        getWifiList: willSupprtConf,
        getConnectedWifi: willSupprtConf,
        connectWifi: willSupprtConf,
        addPhoneContact: willSupprtConf,
        writeBLECharacteristicValue: willSupprtConf,
        readBLECharacteristicValue: willSupprtConf,
        onBLEConnectionStateChange: willSupprtConf,
        onBLECharacteristicValueChange: willSupprtConf,
        offBLEConnectionStateChange: willSupprtConf,
        offBLECharacteristicValueChange: willSupprtConf,
        notifyBLECharacteristicValueChange: willSupprtConf,
        notifyBLECharacteristicValueChange: willSupprtConf,
        getBLEDeviceCharacteristics: willSupprtConf,
        createBLEConnection: willSupprtConf,
        closeBLEConnection: willSupprtConf,
        stopBluetoothDevicesDiscovery: willSupprtConf,
        startBluetoothDevicesDiscovery: willSupprtConf,
        openBluetoothAdapter: willSupprtConf,
        onBluetoothDeviceFound: willSupprtConf,
        onBluetoothAdapterStateChange: willSupprtConf,
        offBluetoothDeviceFound: willSupprtConf,
        offBluetoothAdapterStateChange: willSupprtConf,
        getConnectedBluetoothDevices: willSupprtConf,
        getBluetoothDevices: willSupprtConf,
        getBluetoothAdapterState: willSupprtConf,
        closeBluetoothAdapter: willSupprtConf,
        stopHCE: willSupprtConf,
        startHCE: willSupprtConf,
        sendHCEMessage: willSupprtConf,
        onHCEMessage: willSupprtConf,
        offHCEMessage: willSupprtConf,
        getHCEState: willSupprtConf,
        getExtConfig: willSupprtConf,
        getExtConfigSync: willSupprtConf,

        RealtimeLogManager: deleteObjConf,
        EventChannel: deleteObjConf,
        CameraFrameListener: deleteObjConf,
        EditorContext: deleteObjConf,
        MediaContainer: deleteObjConf,
        OffscreenCanvas: deleteObjConf,
        IBeaconInfo: deleteObjConf,
        WifiInfo: deleteObjConf,

        cancelAnimationFrame: {
            action: 'mapping',
            logLevel: 'info',
            mapping: 'cancelAnimationFrame',
            message: 'Canvas.cancelAnimationFrame方法被替换为cancelAnimationFrame'
        },
        requestAnimationFrame: {
            action: 'mapping',
            logLevel: 'info',
            mapping: 'requestAnimationFrame',
            message: 'Canvas.requestAnimationFrame方法被替换为requestAnimationFrame'
        },
        createImage: {
            action: 'mapping',
            logLevel: 'info',
            mapping: 'createImage',
            message: 'Canvas.createImage方法被替换为createImage'
        },
        checkSession: {
            arg: ['shareTicket'],
            ...DeleteArgConf
        },
        navigateTo: {
            arg: ['events'],
            ...DeleteArgConf
        },
        pageScrollTo: {
            arg: ['selector'],
            ...DeleteArgConf
        },
        chooseMessageFile: {
            arg: ['type', 'extension'],
            ...DeleteArgConf
        },
        onError: {
            obj: 'InnerAudioContext',
            arg: ['errMsg'],
            ...DeleteArgConf
        },
        onStop: {
            obj: 'RecorderManager',
            arg: ['duration', 'fileSize'],
            ...DeleteArgConf
        },
        getLocation: {
            arg: ['isHighAccuracy', 'highAccuracyExpireTime'],
            ...DeleteArgConf
        },
        updateShareMenu: {
            arg: ['isUpdatableMessage', 'activityId', 'templateInfo'],
            ...DeleteArgConf
        },
        canvasToTempFilePath: {
            arg: ['canvasToTempFilePath'],
            ...DeleteArgConf
        },
        createRewardedVideoAd: {
            arg: ['multiton'],
            ...DeleteArgConf
        }
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
