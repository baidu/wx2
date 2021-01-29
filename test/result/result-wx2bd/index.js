swan.navigateTo({
    url: '../logs/logs'
}); // test api exist check in logical expression
  
if (swan.checkIsSupportSoterAuthentication && true) {
    console.log(true);
} // test wx as function arg
  
  
Object.create(wx, {});
console.log(1, wx); // test UnaryExpression
  
if (!swan.checkIsSupportSoterAuthentication) {
    console.log(true);
}
  
if (typeof swan.checkIsSupportSoterAuthentication !== 'function') {
    console.log(true);
}
  
const wx = {};
  
for (const key in wx) {
    console.log(`wx${key}:`, swan[key]);
}
  
while (wx) {
    console.log(`wx${key}:`, swan[key]);
}

swan.aaa = 111;
swan['bbb'] = 222;
swan[ccc] = 333;
let data = swan.getExtConfigSync();
data = swan.getExtConfigSync().ext;
data = aaa[bbb].getExtConfigSync();
data = swan.getExtConfigSync().extConfig;
swan['test'].call(wx, {
    url: 'test'
});
swan.test(swan.testFn, wx);
swan.navigateToMiniProgram();
swan.setClipboardData({
    data: 'data',
  
    success(res) {
      console.log('111');
    }
  
});
swan.setClipboardData({
    data: 'data',
    success: res => {
      console.log('111');
    }
});
swan.setClipboardData({
    data: 'data'
});
Component({
    behaviors: ['wx://form-field', 'wx://component-export'],
    properties: {
      length: {
        type: Number,
        value: 2
      },
      swanIdForSystem: {
        type: String,
        value: ''
      }
    }
  });
  Component({
    'componentGenerics': {
      'selectable': {
        'default': 'path/to/default/component'
      }
    },
    properties: {
      length: {
        type: Number,
        value: 2
      },
      swanIdForSystem: {
        type: String,
        value: ''
      }
    }
  });
  const url1 = e.currentTarget.dataset.coverimg;
  const url2 = e.currentTarget.dataset.coverimg;
  Page({
    onLoad() {
      this.Navbar = this.selectComponent('#Navbar');
      b = this.selectComponent('#btn1');
    },
  
    onReady() {}
  
}); // Page({
//     onLoad(){
//         this.selectAllComponents('.btn2');
//         this.selectComponent('#btn1');
//     },
//     onReady(){
//
//     }
// });
// eslint-disable-next-line
if ("swan" === 'swan') {
    swan.navigateTo({
      url: '../logs/logs'
    });
}

// eslint-disable-next-line  
if ("swan" === 'wx') {
    swan.navigateTo({
      url: '../logs/logs'
    });
}
