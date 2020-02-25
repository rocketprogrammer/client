# Cozy Penguin Client
This is the web-based client for Cozy Penguin, solving the problem of Flash ending support in 2020, resulting in obtaining and using Flash harder. This client has many functions, including:
- Automatically clearing the users' cache when the application is launched (parties and features update instantly!)
- Discord Rich Presence support. Have a shiny Discord status when playing
- Embedded (Pepper) Flash Player. There's no need to install Flash manually.

This is heavily inspired by Penguin World's client. We'd also reccommend creating a new subdomain eg (https://client.cozypenguin.net) so that Flash is fullscreen.
# Installation
`git clone https://github.com/Cozy-Penguin/client`

`npm install`

`npm install discord-rich-presence`

`npm install electron-packager -g`

Customise the files to your liking then test it with

`npm start` (be aware that flash will not load until you publish your game)
**Publishing**

`electron-packager . --overwrite --disable-http-cache --platform=win32 --arch=ia32 --icon=favicon.ico --prune=true --out=release-builds --version-string.cozy-client=1.0.0 --version-string.Cozy Penguin's client.=1.0.0 --version-string.ProductName="Cozy Penguin"`

Then open the folder `release-builds`, followed by `client.=1.0.0-win32-ia32` - then run the .exe!
# License
Please attribute AltoDev and leave all attribution in it's original state.