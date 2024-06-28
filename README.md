# Crypto Rates
### Site with automated deployment from Mac/Linux to for Raspberry Pi

## Requirements:
* This is only site html+js with automated deployment
* additionally needed API for receiving price data (https://github.com/EnjoyFX/crypto_monitor)
## How to use
* Create .env file with variables and place it to project dir.
Example:
```
RPI_USER=pi
RPI_HOST=192.168.0.60
RPI_PATH=/var/www/crypto_rates
RPI_SITE_CONFIG=/etc/nginx/sites-available/crypto_rates
```
* Run script on your local Mac/Linux system:
```
./deploy_mac.sh
```
_Note: Script for Raspberry Pi (`deploy_rpi.sh`) will be called automatically during this process._

As a result you can see something like this (Note: RPI password will be asked during this process):
```
----- RPI deployment for my crypto_rates site -----
✓ Load variables from .env file
✓ Const BASE_URL set successfully in script.js
✓ Copying files to Raspberry Pi...
pi@192.168.0.60's password: 
index.html                                                                                                                                                                100% 1795   212.5KB/s   00:00    
.env                                                                                                                                                                      100%  120    14.2KB/s   00:00    
pi@192.168.0.60's password: 
temp.js                                                                                                                                                                   100% 4464   507.6KB/s   00:00    
✓ Start of deployment script on Raspberry Pi side...
pi@192.168.0.60's password: 
✓ Load variables from .env file
✓ Creating site dir...
✓ Moving files...
✓ Setting nginx...

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Hit:1 http://raspbian.raspberrypi.org/raspbian buster InRelease
Hit:2 http://archive.raspberrypi.org/debian buster InRelease
Reading package lists...
Building dependency tree...
Reading state information...
All packages are up to date.

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Reading package lists...
Building dependency tree...
Reading state information...
nginx is already the newest version (1.14.2-2+deb10u5).
The following packages were automatically installed and are no longer required:
  libdav1d3 libpipewire-0.2-1 python-colorzero xdg-desktop-portal
  xdg-desktop-portal-gtk
Use 'sudo apt autoremove' to remove them.
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
✓ Site config generating...
✓ Checking of nginx config...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
✓ Reload of nginx...
✓ Removing temporary directory...
✓ Deployment DONE!
  Time spent: 28 second(s)
  ```

  * Check you site on Raspberry side, enter in your browser the value from your env-variable `RPI_HOST` :
  ```
http://192.168.0.60/
  ``` 

And check the result! :-) 
