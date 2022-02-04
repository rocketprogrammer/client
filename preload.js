const {ipcRenderer} = require('electron');
window.ipcRenderer = require('electron').ipcRenderer;
let checkExist;

ipcRenderer.on('muted', (event, data) => {
	localStorage.muted = data;
});

ipcRenderer.on('theme', (event, data) => {
	localStorage.theme = data;
});

window.addEventListener('load', (event) => {
});

function load() {
	if(localStorage.muted == undefined){
		localStorage.muted = false;
		localStorage.theme = 'dark';
	}
	ipcRenderer.sendSync('load:data', localStorage.muted, localStorage.theme)
}
function loadSettings() {
}