#!/bin/bash

START_TIME=$(date +%s)

# Colors set (+bold style)
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}----- RPI deployment for my crypto_rates site -----${NC}"
echo -e "${GREEN}✓ Load variables from .env file${NC}"
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${RED}.env file not found!${NC}"
  exit 1
fi

if [ -z "$RPI_HOST" ]; then
  echo -e "${RED}✗ Env variable RPI_HOST not found, please set!${NC}"
  exit 1
fi

# Checking files
JS_FILE="script.js"
if [ ! -f ./index.html ] || [ ! -f ./$JS_FILE ]; then
  echo -e "${RED}Files index.html and $JS_FILE should be in current dir!${NC}"
  exit 1
fi

sed "s#{{RPI_URL_PLACEHOLDER}}#$RPI_HOST#g" "script.js" > temp.js
echo -e "${GREEN}✓ Const BASE_URL set successfully in $JS_FILE${NC}"

echo -e "${GREEN}✓ Copying files to Raspberry Pi...${NC}"
scp index.html .env ${RPI_USER}@${RPI_HOST}:~/crypto_rates/ && scp temp.js ${RPI_USER}@${RPI_HOST}:~/crypto_rates/$JS_FILE
rm temp.js

echo -e "${GREEN}✓ Start of deployment script on Raspberry Pi side...${NC}"
ssh ${RPI_USER}@${RPI_HOST} 'bash -s' < deploy_rpi.sh

END_TIME=$(date +%s)
ELAPSED_TIME=$(($END_TIME - $START_TIME))

echo -e "${GREEN}  Time spent: ${ELAPSED_TIME} second(s)${NC}"
