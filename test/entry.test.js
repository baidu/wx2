const View = require('../src/processor/transformView');
const Css = require('../src/processor/transformCss');
const Js = require('../src/processor/transformJs');
const Bootstrap = require('../src/processor/bootstrap');
const Api = require('../src/processor/transformAPI');
const Log = require('../src/log/log');
const logInstance = new Log('../src/log');

const errorMsg = {
    log: logInstance
};

describe('error', () => {
    test('test transfrom wxss error: ', async () => {
        await Css.transformCss(errorMsg).catch(e => {
            expect.assertions(0);
        });
    });

    test('test transfrom bootstrap error:', async () => {
        await Bootstrap.transformBootstrap(errorMsg).catch(e => {
            expect.assertions(0);
        });
    });

    test('test transfrom view error: ', async () => {
        await Api.transformApi(errorMsg).catch(e => {
            expect.assertions(0);
        });

    });

    test('test transfrom view error: ', async () => {
        await View.transformView(errorMsg).catch(e => {
            expect.assertions(0);
        });
    });

    test('test transfrom js error: ', async () => {
        await Js.transformJS(errorMsg).catch(e => {
            expect.assertions(0);
        });
    });
});
