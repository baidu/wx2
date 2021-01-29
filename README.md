# 项目名称
wx2，微信小程序转换工具

基于已有的原生微信小程序项目，提供零成本平移转换的能力，对小程序间差异进行抹平，提供简单快捷的 API，助力开发者快速互转已有小程序项目。

* 工具会帮你将已有的原生微信小程序转换为目标小程序，目前支持度最好的为百度小程序，其他小程序的能力正在补充中。
* 工具虽然不能完成100%的转换，但可以帮你节省大量的重复开发成本，随着迭代优化，未来转换率会越来越高
* 目前只支持转`百度小程序`，后续支持QQ、支付宝、头条等小程序

## 快速开始

### 安装

```
$ npm i wx2 -g
```

### 使用
切换到自己指定的工作目录，执行全局命令`wx2`，并指定转换`目录路径`，和输出`目录路径`

```bash
// 当前只支持百度小程序，其他小程序后续支持
$ wx2 <微信小程序文件夹> <目标小程序文件夹>
```
> 注： 路径中请包含'/'作为路径标识

### 运行及参数
使用命令行参数`--target`，简写`-t`
```
# 默认，百度小程序
$ wx2 <微信小程序文件夹> <目标小程序文件夹> --target=swan

# 二次迭代
$ wx2 <微信小程序文件夹> <目标小程序文件夹> --target=wx

# 当前版本暂不支持，qq小程序
$ wx2 <微信小程序文件夹> <目标小程序文件夹> --target=qq
```

## 测试

### 测试方法

项目通过jest工具进行单元测试，包括测试结果和测试覆盖率。
```
// 单元测试
npm run jest
```

## 文档

详细文档参见技术官网：https://pan.baidu.com/union/wx2/home#/

## 维护者

owners: 
* gaofei12@baidu.com

committers: 
* zhouyixuan01@baidu.com
* xujie07@baidu.com
* wulinfei@baidu.com
* zhanyongdong@baidu.com
* dengxiaohong01@baidu.com
* lijiaxuan02@baidu.com
* wangshiyuan@baidu.com
* lijinling03@baidu.com
* zhangyatao@baidu.com


## 反馈

issues贡献： 如在使用中遇到问题，请在 https://github.com/baidu/wx2/issues 新建 issues 反馈问题。

## 讨论

微信扫描二维码，欢迎加入wx2技术交流群(添加下列管理员微信，并备注“wx2”，管理员会邀请您入群)：

<img src="https://issuecdn.baidupcs.com/issue/netdisk/ts_ad/help/1605775336.jpg" width = "150" height = "150" alt="图片名称" />
<img src="https://issuecdn.baidupcs.com/issue/netdisk/ts_ad/help/1605775338.jpg" width = "150" height = "150" alt="图片名称" />
<img src="https://issuecdn.baidupcs.com/issue/netdisk/ts_ad/help/1605784743.jpg" width = "150" height = "150" alt="图片名称" />


互转工具百度如流讨论群：3498775




## 版本更新（npm）
* 1.0.18  支持了微信小程序代码直接对wx赋值或引用的转换情况。
* 1.0.19  修复了setClipboardData转换问题。