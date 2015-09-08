var CarMenu = function() {
	this.ViewScale = 1;
	this.internalID = "No car selected";
	this.externalID = "No car selected";
	this.x = "No car selected";
	this.y = "No car selected";
	this.k = "No car selected";
	this.d = "No car selected";
	this.t = "No car selected";
	this.e = "No car selected";
	this.tp = "No car selected";
	this.clearActiveCar = function(){
		cars.forEach(function(car){
			car.removeActivity(car);
		});
	};
	this.newZone = function(){
		zone = new Zone(allZones.length);
		zone.mixZoneSetup();
		zone.newGraphics();
		zone.newText();
	};
	this.clearActiveZone = function(){
		allZones.forEach(function(zone){
			if(zone.isActive){
				zone.removeZone(zone,true);
			}
		});
	};
	this.clearAllZones = function(){
		allZones.forEach(function(x){
			x.removeZone(x);
		});
		allZones = [];
	};
	this.activeZoneId = "No zone selected";
	this.activeZonePingTime = "No zone selected";
	this.activeZoneRadius = "No zone selected";
	this.activeZoneX = "No zone selected";
	this.activeZoneY = "No zone selected";
	
	this.toggelZonesOn = function(){
		allZones.forEach(function(zone){
			zone.isOn = true;
		});
	};
	this.toggelZonesOff = function(){
		allZones.forEach(function(zone){
			zone.isOn = false;
		});
	};
};

var menu = new CarMenu();

var gui = new dat.GUI({ autoPlace: false });
var container = document.getElementById('dat-gui-container');

container.appendChild(gui.domElement);

var scaleController = gui.add(menu, 'ViewScale',0,5).min(.1).step(.1);

gui.add(menu, 'internalID').listen();
var externalIdController = gui.add(menu, 'externalID').listen();
gui.add(menu, 'clearActiveCar').listen();
gui.add(menu, 'x').listen();
gui.add(menu, 'y').listen();
gui.add(menu, 'k').listen();
gui.add(menu, 'd').listen();
gui.add(menu, 't').listen();
gui.add(menu, 'e').listen();
gui.add(menu, 'tp').listen();

gui.add(menu, 'newZone','#00FF00').listen();
gui.add(menu, 'activeZoneId').listen();
gui.add(menu, 'clearActiveZone').listen();
gui.add(menu, 'clearAllZones').listen();
gui.add(menu, 'toggelZonesOn').listen();
gui.add(menu, 'toggelZonesOff').listen();
var activeZonePingTimeController = gui.add(menu, 'activeZonePingTime').listen();
var activeZoneRadiusController = gui.add(menu, 'activeZoneRadius').listen();
var activeZoneXController = gui.add(menu, 'activeZoneX').listen();
var activeZoneYController = gui.add(menu, 'activeZoneY').listen();


scaleController.onFinishChange(function(value){
	document.getElementById('display-canvas').style.height = Math.min(window.innerHeight, window.innerWidth) * value;
	document.getElementById('display-canvas').style.width = Math.min(window.innerHeight, window.innerWidth) * value;
});

