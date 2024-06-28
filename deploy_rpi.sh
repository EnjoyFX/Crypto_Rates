#!/bin/bash

# Colors set (+bold style)
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

cd crypto_rates

echo -e "${GREEN}✓ Load variables from .env file${NC}"
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${RED}.env file not found!${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Creating site dir...${NC}"
sudo mkdir -p ${RPI_PATH}

echo -e "${GREEN}✓ Moving files...${NC}"
sudo mv ~/crypto_rates/index.html ${RPI_PATH}/index.html
sudo mv ~/crypto_rates/script.js ${RPI_PATH}/script.js

echo -e "${GREEN}✓ Setting nginx...${NC}"
sudo apt update
sudo apt install -y nginx

echo -e "${GREEN}✓ Site config generating...${NC}"
sudo bash -c "cat > ${RPI_SITE_CONFIG}" <<EOF
server {
    listen 80;
    server_name crypto_rates;

    root ${RPI_PATH};
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

if [ ! -L /etc/nginx/sites-enabled/crypto_rates ]; then
  sudo ln -s ${RPI_SITE_CONFIG} /etc/nginx/sites-enabled/
fi

echo -e "${GREEN}✓ Checking of nginx config...${NC}"
sudo nginx -t

echo -e "${GREEN}✓ Reload of nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✓ Removing temporary directory...${NC}"
sudo rm -rf ~/crypto_rates/

echo -e "${GREEN}✓ Deployment DONE!${NC}"
