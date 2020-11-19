#!/usr/bin/env bash
# zip打包入口脚本

# export NODE_ENV=production
# export PATH=$NODEJS_BIN_LATEST:$PATH

echo "node $(node -v)"
echo echo "npm v$(npm -v)"

echo "Install npm dependencies"

# 安装json解析
npm install -g json --registry=http://registry.npm.baidu-int.com

version=`cat ../package.json | json version`
echo 'version: '$version
version_code=`cat ../pkginfo.json | json version_code`
version_code=$((version_code+1))
echo 'version_code: '$version_code

# 修改pkginfo中version_name
json -I -f pkginfo.json -e 'this.version_name="'${version}'"'

# 修改pkginfo中version_code
json -I -f pkginfo.json -e 'this.version_code="'${version_code}'"'

npm install --registry=http://registry.npm.baidu-int.com

#生成dist目录
npm run build

# 移除node_modules
rm -r ../node_modules

# 安装dependencies依赖
npm install --production --registry=http://registry.npm.baidu-int.com

压缩所有文件
cd ../dist
cp -r ../../node_modules ../
zip -r ../../swan-wx2swan.zip ../*

cd -

npm install --registry=http://registry.npm.baidu-int.com

echo "Done"
