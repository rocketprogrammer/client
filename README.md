# Cozy Penguin Desktop

# This client has been archived, and no longer connects to Cozy Penguin's game servers -  as the game has closed. Feel free to use this client for your own CPPS, as long as you attribute AltoDev.
This is the web-based client for Cozy Penguin, solving the problem of Flash ending support in 2020, resulting in obtaining and using Flash harder. This client has many functions, including:
- Automatically clearing the users' cache when the application is launched (parties and features update instantly!)
- Discord Rich Presence support. Have a shiny Discord status when playing
- Embedded (Pepper) Flash Player. There's no need to install Flash manually.
- Automatic client updates to add new fuctionality

This is heavily inspired by Penguin World's client. We reccommend creating a separate play page, ~~eg (https://play.cozypenguin.net/desktop)~~ so that Flash is fullscreen.
# User Installation
~~Visit https://cozypenguin.net/downloads and follow the instructions for your PC~~
Alternatively visit the releases page - https://github.com/Cozy-Penguin/client/releases
# Development Installation
`git clone https://github.com/Cozy-Penguin/client`

`npm install`

Customise the files to your liking then test it with

`npm start`

To publish and create an executable file

Windows: `npm run-script build`

macOS: `npm run-script build-mac`


Then open the folder `dist` and run either the .exe for Windows or .pkg for macOS
# License
Please attribute AltoDev and leave all attribution in it's original state.
