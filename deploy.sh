#! /bin/bash

loc=$(pwd)
mode=0

if [ $# -ne 0 ] 
then 
    mode=$1
fi

if (( $mode > 2 ))
then
    echo "Given mode: $mode not valid."
    exit
fi

if (( $mode < 2 ))
then
    config=$(cat config.json | jq '.server')
    ip=$(echo $config | jq -r '.host')
    port=$(echo $config | jq '.port')

    time=$(date)

    mkdir -p "$loc/logs/$time"

    cd $loc/engee-client

    npm install
    npm audit fix

    url="http:\/\/$ip:$port"

    sed -i "s/\"url\":.*/\"url\": \"$url\"/g" ./config.json

    buildLog="$loc/logs/$time/build.log"
    runLog="$loc/logs/$time/run.log"

    echo "Building..."
    npm run build >> "$buildLog" 
    echo "Done."
fi

if [ $mode -ne 1 ]
then
    echo "Running Client..."
    npm run start >> "$runLog"
    echo "Client stopped."
fi

