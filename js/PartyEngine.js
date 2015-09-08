
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
		car.internalColor = (1000 * car.getExternalID() *  0x123456) % 0xFFFFFF
		car.setColor(car.internalColor) ;


	});
	
	cars.forEach(function(car){
		car.setNeighborhood(cars);

	});

	stage.addChild(movingCarsStage);
	stage.addChild(selectedVehicle);


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

	function update() {	
	 	now = Date.now();
		time = now-start;

		//for each car, drive!
		cars.forEach(function(car){


			// car.setColor(Math.random() * 0xFFFFFF);
			// car.setScale(Math.random());


			car.drive(time);

			//car.setScale(car.defaultScale);


			if(car.finishedMoving){
				car.setColor(0x808080);
			} else {
				car.setColor(car.internalColor) ;
			}

			car.setColor(car.internalColor);

			car.setScale(car.defaultScale);



			if((activeVehicle!= null) && (car.getDistanceFrom(activeVehicle) <= 300) && (car != activeVehicle)){
				car.setScale(Math.random() * 5);
				car.setColor((Math.random() * 0xFFFFFF) % 0xFFFFFF);
				if(car.getDistanceFrom(activeVehicle) <= 30){
					car.setColor((Math.random() * 0xFFFFFF) % 0xFFFFFF);
				}
			}


			if(car.isActive){

				activeVehicle = car;

				for (i = activeVehicle.activityLayer.children.length - 1; i >= 0; i--) {
					activeVehicle.activityLayer.removeChild(activeVehicle.activityLayer.children[i]);
				}

				activeVehicle.drawPath(20,0xFFFFFF);

				graphics = new PIXI.Graphics();

				graphics.lineStyle(10,(Math.random() * 0xFFFFFF) % 0xFFFFFF);
				graphics.beginFill((Math.random() * 0xFFFFFF) % 0xFFFFFF);
				graphics.drawCircle(activeVehicle.getPosition()[0],activeVehicle.getPosition()[1],300);

				graphics.lineStyle(10,(Math.random() * 0xFFFFFF) % 0xFFFFFF);
				graphics.drawCircle(activeVehicle.getPosition()[0],activeVehicle.getPosition()[1],30);

				selectedVehicle.addChild(graphics);

				activeVehicle.activityLayer.addChild(activeVehicle.sprite);

				menu.internalID = activeVehicle.internalID;
				menu.externalID = activeVehicle.externalID;
				menu.x = parseInt(activeVehicle.getPosition()[0]);
				menu.y = parseInt(activeVehicle.getPosition()[1]);
			}
		});



		stage.removeChild(movingCarsStage);
		stage.addChild(movingCarsStage);

	    renderer.render(stage);

	    requestAnimFrame( update );
	}