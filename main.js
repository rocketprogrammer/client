/*

    Sunrise Games's Downloadable Client
    Copyright (C) 2021 Rocket<sunrise.games>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Modules and variables
 */
const { app, dialog, BrowserWindow, Menu, MenuItem, ipcMain, nativeTheme, globalShortcut, session } = require('electron')
const path = require('path')

const { autoUpdater } = require('electron-updater');

const DiscordRPC = require('discord-rpc');

const aboutMessage = `Sunrise Games Client v${app.getVersion()}
Based off the Coastal Freeze client.`;

const startTimestamp = new Date();

const buttons = [
    { label: 'Legacy', url: 'https://legacy.waddle.sunrise.games' },
    { label: 'Modern', url: 'https://modern.waddle.sunrise.games' }
]

/**
 * This switch case will return the correct DLL/so/plugin for the app
 */
let pluginName
switch (process.platform) {
    case 'win32':
        switch (process.arch) {
            case 'ia32':
            case 'x32':
                pluginName = 'flash/windows/32/pepflashplayer.dll'
                break
            case 'x64':
                pluginName = 'flash/windows/64/pepflashplayer.dll'
                break
        }
        break
    case 'linux':
        switch (process.arch) {
            case 'ia32':
            case 'x32':
                pluginName = 'flash/linux/32/libpepflashplayer.so'
                break
            case 'x64':
                pluginName = 'flash/linux/64/libpepflashplayer.so'
                break
        }

        app.commandLine.appendSwitch('no-sandbox');
        break
    case 'darwin':
        pluginName = 'flash/mac/PepperFlashPlayer.plugin'
        break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch('disable-http-cache');

/**
 * Activates Discord Rich Presence
 * @returns {void}
 */
let rpc;
function activateRPC() {
    DiscordRPC.register('830823841516879892');
    rpc = new DiscordRPC.Client({
        transport: 'ipc'
    });
    rpc.on('ready', () => {
        setDiscordPresence();
    });
    rpc.login({
        clientId: '592845025331642389'
    }).catch(console.error);
}

function loadPage(webPage) {
    mainWindow.loadURL(webPage);
    setDiscordPresence();
}

function setDiscordPresence() {
    rpc.setActivity({
        details: isLegacyPenguin() ? 'Legacy Club Penguin' : 'Modern Club Penguin',
        state: 'Logging in...',
        startTimestamp,
        largeImageKey: 'icon',
        buttons: buttons
    }).catch(console.error);
}

function setupZonePresence(zoneId, penguinName) {
    var roomIdToName = {
        100: 'Town Center',
        110: 'Coffee Shop',
        111: 'Book Room',
        120: 'Night Club',
        121: isLegacyPenguin() ? 'Dance Lounge' : 'Arcade',
        952: 'Dance Contest',
        900: 'Astro Barrier',
        909: 'Thin Ice',
        320: 'Dojo',
        130: isLegacyPenguin() ? 'Gift Shop' : 'Clothes Shop',
        959: 'Smoothie Smash',
        300: 'The Plaza',
        310: 'Pet Shop',
        955: 'Puffle Launch',
        956: 'Bits & Bolts',
        998: 'Card Jitsu',
        951: 'Sensei'
    }

    var roomIdToImage = {
        100: isLegacyPenguin() ? 'town_2006_ice_rink' : 'town_2012_ice_rink',
        110: isLegacyPenguin() ? 'coffee_shop_as2' : 'coffee_shop_2012',
        111: isLegacyPenguin() ? 'book_room_2005' : 'book_room_2012',
        120: isLegacyPenguin() ? 'night_club_as2' : 'dance_club_july_2014',
        121: isLegacyPenguin() ? 'dance_lounge_2006' : 'arcade',
        952: 'dance_contest_logo',
        900: 'astrobarrierstartscreennewfont',
        909: 'thin_ice',
        320: isLegacyPenguin() ? 'dojo_2009' : 'dojo_2013',
        130: isLegacyPenguin() ? 'gift_shop_2009': 'clothes_shop',
        959: 'ss_game_menu',
        300: isLegacyPenguin() ? 'plaza_before_2012' : 'plaza08july2015',
        310: isLegacyPenguin() ? 'pet_shop_2010' : 'pet_shop_2014',
        955: 'puffle_launch',
        956: 'bits-and-bolts',
        998: 'card_jitsu_deck',
        951: 'sensei'
    }

    rpc.setActivity({
        details: penguinName,
        state: roomIdToName[zoneId] || 'Waddling',
        startTimestamp,
        largeImageKey: roomIdToImage[zoneId] || 'icon',
        largeImageText: isLegacyPenguin() ? 'Legacy Club Penguin' : 'Modern Club Penguin',
        buttons: buttons
    }).catch(console.error);
}

/**
 * creates the loading screen
 * @returns {void}
 */
let loadingScreen;
function createLoadingScreen() {
    /// create a browser mainWindow

    loadingScreen = new BrowserWindow({
        /// define width and height for the mainWindow
        width: 1280,
        height: 720,
        /// remove the mainWindow frame, so it will become a frameless mainWindow
        frame: false,
        /// and set the transparency, to remove any mainWindow background color
        transparent: true
    }
    );
    if (mainWindow) mainWindow.close()
    loadingScreen.setResizable(false);
    loadingScreen.loadURL(
        'file://' + __dirname + '/window/loading.html'
    );
    loadingScreen.on('closed', () => (loadingScreen = null));
    loadingScreen.webContents.on('did-finish-load', () => {
        createWindow();
        mainWindow.webContents.on('did-finish-load', () => {
            if (loadingScreen) loadingScreen.close()
            if (!rpc) activateRPC()
            mainWindow.show()
        })
    });
};

/**
 * Creates the Menu Bar
 * @returns {Menu}
 */
function createMenu() {
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: 'Sunrise Games Client',
            submenu: [{
                label: 'About',
                click: () => {
                    dialog.showMessageBox({
                        type: 'info',
                        buttons: ['Ok'],
                        title: 'About Sunrise Games',
                        message: aboutMessage
                    });
                }
            },
            {
                label: 'Fullscreen (Toggle)',
                accelerator: 'CmdOrCtrl+F',
                click: () => {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    mainWindow.webContents.send('fullscreen', mainWindow.isFullScreen());
                }
            },
            {
                label: 'Mute Audio (Toggle)',
                accelerator: 'CmdOrCtrl+M',
                click: () => {
                    mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
                    mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
                }
            },
            {
                label: 'Log Out',
                click: () => createLoadingScreen()
            },
            {
                label: 'Legacy',
                click: () => loadPage('https://legacy.waddle.sunrise.games')
            },
            {
                label: 'Modern',
                click: () => loadPage('https://modern.waddle.sunrise.games')
            }
            ]
        }));
    } else {
        fsmenu.append(new MenuItem({
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: 'info',
                    buttons: ['Ok'],
                    title: 'About Sunrise Games',
                    message: aboutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Fullscreen (Toggle)',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Mute Audio (Toggle)',
            accelerator: 'CmdOrCtrl+M',
            click: () => {
                mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
                mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
            }
        }));
        fsmenu.append(new MenuItem({
            'label': 'Legacy',
            click: () => loadPage('https://legacy.waddle.sunrise.games')
        }));
        fsmenu.append(new MenuItem({
            'label': 'Modern',
            click: () => loadPage('https://modern.waddle.sunrise.games')
        }));
        fsmenu.append(new MenuItem({
            label: 'Log Out',
            click: () => createLoadingScreen()
        }));
    }
    return fsmenu
}

/**
 * creates MainWindow
 * @returns {void}
 */
let mainWindow;
function createWindow() {
    // Create the browser mainWindow.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        useContentSize: true,
        show: false,
        title: 'Sunrise Games',
        icon: __dirname + '/assets/icon.ico',
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            plugins: true,
            nodeIntegration: false,
            webSecurity: false,
            contextIsolation: false
        }
    })
    registerKeys()
    Menu.setApplicationMenu(createMenu());
    mainWindow.loadURL('http://localhost/');
    // mainWindow.loadURL('http://localhost/as3/');
    // mainWindow.loadURL('https://modern.waddle.sunrise.games');
}

function isLegacyPenguin() {
    let currentURL = mainWindow.webContents.getURL();

    if (currentURL.includes('legacy.waddle') || currentURL == 'http://localhost/') {
        // This is the Legacy client.
        return true;
    }

    // Assume this is the Modern client.
    return false;
}

/**
 * Registers the Shortcuts
 * @returns {void}
 */
function registerKeys() {
    globalShortcut.register('CmdOrCtrl+Shift+I', () => {
        mainWindow.webContents.openDevTools();
    })
}

/**
 * Auto Updater and Events!
 */

/**
* This event will fire if update is downloaded
* @returns {void}
*/

let updateAv = false;
autoUpdater.on('update-downloaded', () => {
    updateAv = true;
});

/**
 * This event will fire if electron is ready
 * @returns {void}
 */

app.whenReady().then(() => {
    createLoadingScreen()
    autoUpdater.checkForUpdatesAndNotify();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createLoadingScreen()
    })
})

/**
 * This event will fire if the windows are all closed
 * @returns {void}
 */

app.on('window-all-closed', () => {
    if (updateAv) autoUpdater.quitAndInstall();
    if (process.platform !== 'darwin') app.quit();
});

/**
 * This event will fire whenever an update is available
 * @param {Object}
 * @returns {void}
 */

autoUpdater.on('update-available', (updateInfo) => {
    switch (process.platform) {
        case 'win32':
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Ok'],
                title: 'Update Available',
                message: 'There is a new version available (v' + updateInfo.version + '). It will be installed when the app closes.'
            });
            break
        case 'darwin':
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Ok'],
                title: 'Update Available',
                message: 'There is a new version available (v' + updateInfo.version + '). Please go install it manually from the website.'
            });
            break
        case 'linux':
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Ok'],
                title: 'Update Available',
                message: 'There is a new version available (v' + updateInfo.version + '). Auto-update has not been tested on this OS, so if after relaunching app this appears again, please go install it manually.'
            });
            break
    }
});

/**
 * This Event will fire if 'load:data' was sent from the site
 * @param {event}
 * @param {String}
 * @param {String}
 * @returns {void}
 */

ipcMain.on('load:data', (event, mute, theme) => {
    muted = (mute === 'true');
    nativeTheme.themeSource = theme;
    mainWindow.webContents.audioMuted = muted;

    mainWindow.webContents.send('theme', nativeTheme.themeSource);
});

/**
 * End of Auto Updater part
 */

// Discord Rich Presence
ipcMain.on('setDiscordZone', function (event, zoneId, penguinName) {
    setupZonePresence(zoneId, penguinName);
});