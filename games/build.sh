#!/bin/bash
if [ $# -eq 0 ]
then
    echo Usage:
    echo build [release [map]]
    exit 0
fi

rollup index.js --o bundle.js --f es -m inline

if [ $# -gt 0 ]
then
    if [ $1 == 'release' ]
    then
        uglifyjs -c -m -o dist/index.js bundle.js --source-map "content=inline"
        if [ $# -gt 1 ]
        then
            if [ $2 == 'map' ]
            then
                echo "//# sourceMappingURL=index.js.map" >> dist/index.js
            else
                echo Unknown option "$2"
                exit 65
            fi
        fi
    else
        echo Unknown option "$1"
        exit 64
    fi
else
    cp bundle.js dist/index.js
fi