#! /bin/bash
echo "Running client deploy script..."

loc=$(pwd)

ip=$SERVER_HOST
port=$SERVER_OUTER

if [ -z "${ip}" ] | [ -z "${port}"]
then
    config=$(cat config.json | jq '.server')
    ip=$(echo $config | jq -r '.host')
    port=$(echo $config | jq '.port')
fi

time=$(date)

mkdir -p "$loc/logs/$time"

cd $loc/engee-client

npm install
npm audit fix

url="http:\/\/$ip:$port"

sed -i "s/\"url\":.*/\"url\": \"$url\"/g" ./src/config.json

buildLog="$loc/logs/$time/build.log"
runLog="$loc/logs/$time/run.log"

echo "Building..."
npm run build >> "$buildLog" 
echo "Done."

echo "Running Client..."
npm run start >> "$runLog"
echo "Client stopped."
