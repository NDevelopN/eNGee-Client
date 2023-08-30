#! /bin/bash

echo "Enter the IP of the server"
read ip

echo "Enter the port of the server"
read port



time=$(date)

mkdir "./logs/$time"

cd ./engee-client

url="http:\/\/$ip:$port"

sed -i "s/\"url\":.*/\"url\": \"$url\"/g" ./config.json

buildLog="../logs/$time/build.log"
runLog="../logs/$time/run.log"

echo "Building..."
npm run build >> "$buildLog" 
echo "Done."

echo "Running Client..."
npm run start >> "$runLog"
echo "Client stopped."

