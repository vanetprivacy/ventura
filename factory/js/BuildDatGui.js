var MapMenu = function() {
	this.MapSize = "";
};

var menu = new MapMenu();

var gui = new dat.GUI({ autoPlace: false });
var container = document.getElementById('dat-gui-container');

container.appendChild(gui.domElement);
gui.add(menu, 'MapSize').listen();
