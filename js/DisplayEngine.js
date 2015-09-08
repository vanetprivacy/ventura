
	/*
	.	This is an engine to agnostically display trace data
	.	
	.	This engine assumes the trace data will be in an array known as
	.		tracedata[]
	.
	.	This engine assumes the trace data will be of the form:
	.
	.		start	id	x1	y1	x2	y2	duration
	.
	.	
	.	This engine assumes the primary canvas is by the name of
	.		'display-canvas'
	.		
	*/


	//First thing's first, we need to parse through all the trace data
	//	and make unique paths


	var allPaths =   []; //Where the final paths will be sent

	numOfLengths = tracedata.length;

	for(var i = 0; i < numOfLengths; i++){ //for each line of trace data
		pD = tracedata[i].split(" "); //split the values

		temp = new Length(pD[0], pD[1],pD[2],pD[3],pD[4],pD[5],pD[6]); //make the values into a length called temp

		if(allPaths[temp.id]){ //If there is a path by the id of this length
			allPaths[temp.id].addLength(temp); //add the length to that path

		} else  { //If there is no path, then we need to make one and seed it with this one
			allPaths[temp.id] = new Path(temp.id); //make a path
			allPaths[temp.id].addLength(temp); //add the length
		}	

	}


	// Now that we have all the paths in allPaths[], we need to create 
	// a series of MobileEntity 's using those paths

	// create an new instance of a pixi stage
	// second instance allows interaction with stage elements
	var stage = new PIXI.Stage(0x000000, true);

	var movingCarsStage = new PIXI.DisplayObjectContainer();
	movingCarsStage.visible = true;

	var selectedVehicle = new PIXI.DisplayObjectContainer();
	selectedVehicle.visible = true;
	
	var carLayerStage = new PIXI.DisplayObjectContainer();
	carLayerStage.visible = true;
	
	var zoneStage = new PIXI.DisplayObjectContainer();
	zoneStage.visible = true;
	var allZones = [];
	


	var movingCars = [];


	var cars = []; //Where the mobile entity's will be sent

	allPaths.forEach(function(path){
		car = new MobileEntity(path.id);
		car.setPath(path);
		car.setDefaultImage("images/8 Pixel White.png");
		car.setDefaultCanvas(movingCarsStage);
		car.makeSprite();
		car.setDefaultScale(1.5);
		car.addActivityLayer(selectedVehicle);

		cars[cars.length] = car;
		car.internalColor = (1000 * car.getExternalID() *  0x123456) % 0xFFFFFF;
		car.setColor(car.internalColor) ;


	});
	
	cars.forEach(function(car){
		car.setNeighborhood(cars);

	});

	stage.addChild(movingCarsStage);
	stage.addChild(selectedVehicle);
	stage.addChild(carLayerStage);
	stage.addChild(zoneStage);


	//Now that we have all of our entities
	//Lets create the time related variables that the heartbeat of our program will rely on

	var start = Date.now();
	var now = Date.now();
	var time = now-start;


	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(3000, 3000, document.getElementById('display-canvas'));

	document.getElementById('display-canvas').style.height = Math.min(window.innerHeight, window.innerWidth);
	document.getElementById('display-canvas').style.width = Math.min(window.innerHeight, window.innerWidth);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

//tick()


	requestAnimFrame( update );
//Here is the heartbeat
		activeVehicle = null;
		activeZone = null;

	function update() {	
	 	now = Date.now();
		time = now-start;	

	//for each car, drive!
	cars.forEach(function(car){
		car.setScale(car.defaultScale);
		car.drive(time);
		if(car.finishedMoving){
			car.setColor(0x808080);
			if(car.kset.length > 0){
				car.kr2 = time;
			}
		} else {
			car.setColor(car.internalColor) ;
		}
		if(car.isActive){
			activeVehicle = car;
			
			externalIdController.onFinishChange(function(value){
				activeVehicle.setExternalID(value);
			});
			//resets activity graphics
			for (i = activeVehicle.activityLayer.children.length - 1; i >= 0; i--) {
				activeVehicle.activityLayer.removeChild(activeVehicle.activityLayer.children[i]);
			}

			activeVehicle.drawPath(20,0xFFFFFF);
			
			graphics = new PIXI.Graphics();
			graphics.lineStyle(10,0x0000FF,0.5);
			graphics.beginFill(0xFFFFFF,0.5);
			graphics.drawCircle(activeVehicle.getPosition()[0],activeVehicle.getPosition()[1],300);

			graphics.lineStyle(10,0xFF0000,0.5);
			graphics.drawCircle(activeVehicle.getPosition()[0],activeVehicle.getPosition()[1],30);

			graphics.lineStyle(10,activeVehicle.internalColor);
			graphics.beginFill(activeVehicle.internalColor);
			graphics.drawCircle(activeVehicle.getPosition()[0],activeVehicle.getPosition()[1],20);
			
			menu.internalID = activeVehicle.internalID;
			menu.externalID = activeVehicle.externalID;
			menu.x = parseInt(activeVehicle.getPosition()[0]);
			menu.y = parseInt(activeVehicle.getPosition()[1]);
			var k = parseInt( activeVehicle.get_k(activeVehicle) );
			menu.k = k
			menu.d = parseInt( activeVehicle.get_d(activeVehicle) );
			if(activeVehicle.kr != null){
				menu.t = parseInt( activeVehicle.get_t(activeVehicle,time) );
			}else{
				menu.t = parseInt(0);
			}
			menu.e = Math.log2(k)
			menu.tp = (1/k)*100
			if(activeVehicle.finishedMoving){
				activeVehicle.removeActivity(activeVehicle);
			}
			
			//////////////////////////////////////////////////////////
			///////////Layers for mixed cars./////////////
			////////////////////////////////////////////////////////
			if(activeVehicle.kset.length > 0){
				for (var i = carLayerStage.children.length - 1; i >= 0; i--) {
					carLayerStage.removeChild(carLayerStage.children[i]);
				};
				var color = activeVehicle.kcolor;
				graphics.lineStyle(5,color,1);
				graphics.beginFill(color,0.3);
				var layerlog = [];
				activeVehicle.kset.forEach(function(c){
					if(activeVehicle != c){
						if(layerlog.indexOf(c) == -1){
							graphics.drawCircle(c.getPosition()[0],c.getPosition()[1],30);
							layerlog.push(c);
						}
					}
				});
			}
			selectedVehicle.addChild(graphics);
			selectedVehicle.addChild(activeVehicle.sprite);
		}else{
		}
	
		//Zone + Car interaction
		if(allZones.length != 0){
			allZones.forEach(function(zone){
				//zone.updateTime(time);
				if(zone.isOn){
				
					//car and zone grouping functions
					if(zone.getDistanceFromCar(car) < zone.r){
						if(car.currentZone == null){
							if(car.pastZones.indexOf(zone) == -1){
								zone.carEnter(car,time);
							}
						}
					}else{
						if(car.pastZones.indexOf(zone) != -1){
							car.pastZones.splice(car.pastZones.indexOf(zone),1);
						}
					}
					
					//Car and zone mixing functions
					if((time - zone.lastMix) >= zone.tping){
						if(zone.kset.length > 0){
							zone.mixCars(zone,time);
						}else{
							zone.lastMix = time;
						}
					}
					//zone Display
					var newtext = parseFloat((time - zone.lastMix)/1000).toFixed(1);
					zone.redrawText(newtext);
				}
			});
		}
	});
		
		
		
		//Active Connection Functions
		/*
		//connect / reconnect ranked cars to active
		var rankAverage = null;
		var rankCount = 0;
		cars.forEach(function(car){
			if(car.isActive){
				if(distRankings.length != 0){
					rank1 = distRankings[0];
					rank1.setScale(3);
					rank1.setColor(0xFF0000);
					rank1.drawConnection(rank1,car,4,0xFF0000);
					rankAverage += rank1.getDistanceFrom(car);
					rankCount ++;
					if(distRankings.length > 1){
						rank2 = distRankings[1];
						rank2.setScale(2.5);
						rank2.setColor(0x0000FF);
						rank2.drawConnection(rank2,car,4,0x0000FF);
						rankAverage += rank2.getDistanceFrom(car);
						rankCount ++;
						if(distRankings.length > 2){
							rank3 = distRankings[2];
							rank3.setScale(2);
							rank3.setColor(0x00FF00);
							rank3.drawConnection(rank3,car,4,0x00FF00);
							rankAverage += rank3.getDistanceFrom(car);
							rankCount ++;
						}
					}
				}
			}
		});
		*/
		//Zone Functions
		allZones.forEach(function(zone){
			//Zone Interaction Function
			if(zone.isActive){
				var activeZone = zone;
				menu.activeZoneId = activeZone.id;
				menu.activeZonePingTime = activeZone.tping;
				menu.activeZoneDeltaTime = activeZone.tdelta;
				menu.activeZoneRadius = activeZone.r;
				menu.activeZoneX = activeZone.x;
				menu.activeZoneY = activeZone.y;
				menu.activeZoneY = activeZone.y;
					//////////////////
				activeZonePingTimeController.onFinishChange(function(value){
					var newvalue= parseInt(value);
					activeZone.setPingTime(newvalue);
				});
					////////////////////////////////
				activeZoneRadiusController.onFinishChange(function(value){
					var newvalue= parseInt(value);
					activeZone.setRadius(newvalue);
					activeZone.redrawGraphics();
				});
					////////////////////////
				activeZoneXController.onFinishChange(function(value){
					var newvalue= parseInt(value);
					activeZone.setPosition(newvalue,activeZone.y);
					activeZone.redrawGraphics();
				});
				activeZoneYController.onFinishChange(function(value){
					var newvalue = parseInt(value);
					activeZone.setPosition(activeZone.x,newvalue);
					activeZone.redrawGraphics();
				});
			}
			if(zone.lift){
				var liftZone = zone;
				var mousePos = stage.getMousePosition();
				liftZone.setPosition(mousePos.x ,mousePos.y);
				liftZone.setLineColor(0xFF0000);
				liftZone.redrawGraphics();
				zone.reset = true;
			}
			else if(zone.resize){
				var resizeZone = zone;
				var mousePos = stage.getMousePosition();
				var xdist = mousePos.x - resizeZone.x;
				var ydist = mousePos.y - resizeZone.y;
				var radius = (xdist + ydist) / 2;
				resizeZone.setRadius(Math.ceil(radius));
				resizeZone.setResizePosition(mousePos.x,mousePos.y);
				resizeZone.setLineColor(0x0000FF);
				resizeZone.redrawGraphics();
				zone.reset = true;
			}
			else if(zone.reset){
				zone.setLineColor(0x00FF00);
				zone.setResizePosition((zone.x+zone.r)-(zone.r/3),(zone.y+zone.r)-(zone.r/3));
				zone.redrawGraphics();
				zone.reset = false;
			}
	
	});
		
		
		stage.removeChild(movingCarsStage);
		stage.addChild(movingCarsStage);
		// Re places zone stage on top
		stage.swapChildren(movingCarsStage,zoneStage);
		stage.addChild(carLayerStage);
		stage.swapChildren(carLayerStage,zoneStage);

	    renderer.render(stage);
	    requestAnimFrame( update );
	}