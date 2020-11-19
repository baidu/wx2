#!/bin/bash

set -e

export PATH=/home/work/node/bin/:$PATH
export CC=/opt/compiler/gcc-4.8.2/bin/gcc
export CXX=/opt/compiler/gcc-4.8.2/bin/g++

# npm install --registry=http://registry.npm.baidu-int.com --production

# tplFile="node_modules/source-map-resolve/source-map-resolve.js"
# # 删除.template结尾的文件。防止和orcp的模板功能冲突导致部署失败。
# if [[ -f $tplFile && -f "$tplFile.template" ]]; then
# cat $tplFile > "$tplFile.template"
# else
# echo "tplFile => [$tplFile] has not exists!"
# fi

TAR="joy-cli.tar.gz"

if [[ ! -d "./output" ]]; then
  mkdir output
else
  rm -rf output
fi

#将output目录进行打包
tar zcf $TAR ./*

mv $TAR ./output

echo "build end"