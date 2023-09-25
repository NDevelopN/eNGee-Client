#! /bin/bash


config=$(cat config.json | jq '.client')
ip=$(echo $config | jq '.host')
port=$(echo $config | jq '.port')

time=$(date)

mkdir -p "./logs/$time"

cd ./engee-client

npm install
npm audit fix

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

