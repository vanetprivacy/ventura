
//A length object
	function Length(t_start, id, x1, y1, x2, y2, duration){
		this.start = parseFloat(t_start) * 1000;
		this.id = parseInt(id);
		this.x1 = parseFloat(x1);
		this.y1 = parseFloat(y1);
		this.x2 = parseFloat(x2);
		this.y2 = parseFloat(y2);
		this.duration = parseFloat(duration) * 1000;
		this.end = (parseFloat(t_start) + parseFloat(duration)) * 1000;

		this.xStep = (this.x2 - this.x1)/(this.duration);
		this.yStep = (this.y2 - this.y1)/(this.duration);

	}


//A path has many lengths
	function Path(id){
		this.lengths = [];
		this.id = id;	
	}

	Path.prototype.countLengths = function() {
		return this.lengths.length;
	};

	Path.prototype.addLength = function(someLength) {
		this.lengths.push(someLength);
	};

	Path.prototype.removeLength = function(length) {
		this.lengths.splice(this.lengths.indexOf(length),1);
	};

	Path.prototype.drawPath = function(canvas,pixelWidth,color) {

		graphics = new PIXI.Graphics();
		graphics.lineStyle(pixelWidth,color);

		graphics.moveTo(this.lengths[0].x1, this.lengths[0].y1);
		graphics.lineTo(this.lengths[0].x2, this.lengths[0].y2);

		for(var i=1; i < this.countLengths(); i++){
		 	graphics.lineTo(this.lengths[i].x2, this.lengths[i].y2);
		 }

		 canvas.addChild(graphics);

	};

	Path.prototype.lengthAfter = function(someLength) {
		if(this.lengths.indexOf(someLength)  < this.lengths.length )
			return this.lengths[this.lengths.indexOf(someLength) + 1];
		else
			console.log("Error trying to access length at end of path");
	};

	Path.prototype.getFirstLength = function() {
		return this.lengths[0];
	};

	Path.prototype.getLastLength = function() {
		return this.lengths[this.countLengths() - 1];
	};

//An entity object

	function Entity(internalID){
		this.internalID = internalID;
		this.externalID = internalID;
		this.x = 0;
		this.y = 0;
		this.sprite = null;
		this.hasCanvas = false;
		this.hasSprite = false;
		this.hasActivityLayer = false;
		this.activityLayer = null; //Where cool stuff happens!
		this.isActive = false; //will be true if this is active!
		this.neighborhood = null;
		this.defaultImage = null;

	}

	Entity.prototype.setDefaultImage = function(image) {
		this.defaultImage = image;
	};

	Entity.prototype.setTexture = function(texture) {
		temp_texture = PIXI.Texture.fromImage(texture);
		this.sprite.setTexture(temp_texture);
	};

	Entity.prototype.setNeighborhood = function(inputNeighborhood) {
		this.neighborhood = inputNeighborhood;
	};

	Entity.prototype.setColor = function(color) {
		this.sprite.tint = color;
	};

	Entity.prototype.setScale = function(num) {
		this.sprite.scale.x = this.sprite.scale.y = num;
	};

	Entity.prototype.setDefaultScale = function(num) {
		this.defaultScale = num;
	};

	Entity.prototype.getColor = function() {
		return this.sprite.tint;
	};

	Entity.prototype.makeSprite = function() {

		// //Now all the nimbly bimbly pixijs stuff
		this.texture = PIXI.Texture.fromImage(this.textureImage);
		this.sprite = new PIXI.Sprite(this.texture);

		// //Make the sprite interactive
		this.sprite.setInteractive(true);
		this.sprite.buttonMode = true;
		this.sprite.hitArea = new PIXI.Rectangle(-20,-20,40,40);

		//Add the entity wrapper as a member of this sprite

		this.sprite.entity = this;

		// //Manipulate the sprite based on its center
		this.sprite.anchor.x = .5;
		this.sprite.anchor.y = .5;	
		this.hasSprite = true;

		this.sprite.mousedown = function(){
			//Default sprite mousedown event
		};
	};

	Entity.prototype.getPosition = function() {
		return [this.x, this.y];
	};

	Entity.prototype.setPosition = function(x,y) {

		this.x = x;
		this.y = y;
		this.sprite.position.x = x;
		this.sprite.position.y = y;
	};



	Entity.prototype.getInternalID = function(){
		return this.internalID;
	};

	Entity.prototype.getExternalID = function() {
		return this.externalID;
	};

	Entity.prototype.setExternalID = function(id) {
		this.externalID = id;
		this.internalColor = (1000 * id *  0x123456) % 0xFFFFFF;
	};


	Entity.prototype.setRadius = function(radius) {
		this.radius = radius;
	};

	Entity.prototype.getDistanceFrom = function(otherEntity) {
		myPos = this.getPosition();
		theirPos = otherEntity.getPosition();
		return Math.sqrt(Math.pow((myPos[0] - theirPos[0]),2) + Math.pow((myPos[1] - theirPos[1]),2));
	};

	Entity.prototype.addToCanvas = function(canvas) {
		canvas.addChild(this.sprite);
	};

	Entity.prototype.removeFromCanvas = function(canvas) {
		canvas.removeChild(this.sprite);
	};

	Entity.prototype.setDefaultCanvas = function(canvas) {
		this.canvas = canvas;
		this.hasCanvas = true;
	};

	Entity.prototype.addActivityLayer = function(someCanvas) {
		this.hasActivityLayer = true;
		this.activityLayer = someCanvas;
	};

	Entity.prototype.removeActivity = function(car){
		car.isActive = false;
		movingCarsStage.addChild(car.sprite);
		for (i = activeVehicle.activityLayer.children.length - 1; i >= 0; i--) {
			activeVehicle.activityLayer.removeChild(activeVehicle.activityLayer.children[i]);
		}
	}

	Entity.prototype.get_k = function(c){
		return c.kset.length + 1;
	}
	Entity.prototype.get_d= function(c){
		var avgDist = 0;
		var avgIndex = 0;
		c.kset.forEach(function(c2){
			avgDist += c.getDistanceFrom(c2);
			avgIndex ++;
		});
		return (avgDist / avgIndex);
	}
	Entity.prototype.get_t = function(c,time){
		var t;
		if(c.kr2 == null){
			t = time - c.kr;
		}else{
			t = c.kr2 -c.kr;
		}
		return t/1000;
	}

//end entity object
//begin mobile entity
//Make mobile entity inherit entity, can probably be done better

////CAR = MOBILEENTITY;
	function MobileEntity(internalID) {
		Entity.call(this,internalID);
		this.inactiveImage = null;
		this.hasPath = false;
		this.spawned = false;
		this.finishedMoving = false;
		//anonymity Data
		this.currentZone = null;//current zone the car resides in.
		this.pastZones = [];
		this.ke = null;//time that car entered zone
		this.ks = null;//A time length set to become silent passed by zone.
		this.kr = null;//Time that a car is dropped from a zone.
		this.kr2 = null;//Time a car finishes anonymity.
		this.kset = [];//all cars this has become mixed with
		this.kcolor = 0xFF0000;
		this.k = 0;//number of cars this has mixed with
		//
	};

	MobileEntity.prototype = Object.create(Entity.prototype);
	
	MobileEntity.prototype.setDefaultTexture = function(texture) {
		this.textureImage = texture;
	};

	MobileEntity.prototype.setTexture = function(texture) {
		temp_texture = PIXI.Texture.fromImage(texture);
		this.sprite.setTexture(temp_texture);
	};

	MobileEntity.prototype.setInactiveImage = function(image) {
		this.inactiveImage = image;
	};

	MobileEntity.prototype.drawPath = function(pixelWidth,color) {
		this.path.drawPath(this.activityLayer, pixelWidth,color);
	};

	MobileEntity.prototype.makeSprite = function() {

		// //Now all the nimbly bimbly pixijs stuff
		this.texture = PIXI.Texture.fromImage(this.defaultImage);
		this.sprite = new PIXI.Sprite(this.texture);

		// //Make the sprite interactive
		this.sprite.setInteractive(true);
		this.sprite.buttonMode = true;
		this.sprite.hitArea = new PIXI.Rectangle(-20,-20,40,40);

		//Add the entity wrapper as a member of this sprite

		this.sprite.entity = this; //You need this, silly

		// //Manipulate the sprite based on its center
		this.sprite.anchor.x = .5;
		this.sprite.anchor.y = .5;	
		this.hasSprite = true;


		this.sprite.mousedown = function(){
			if(this.entity.hasActivityLayer ){
				for(i = 0; i < this.entity.neighborhood.length; i++){
					if(this.entity.neighborhood[i].isActive){//just some clean up

						previousActive = this.entity.neighborhood[i];

						previousActive.setScale(previousActive.defaultScale);
						previousActive.addToCanvas(previousActive.canvas);

						previousActive.isActive = false; //make sure that this is not active
					}
				}
					this.entity.removeFromCanvas(this.entity.canvas);
					this.entity.addToCanvas(this.entity.activityLayer);
					this.entity.isActive = true;

			} else {
				console.log("Silly, you need an activity layer to draw stuff!");
			}
		};
	};

	MobileEntity.prototype.path = function() {
		return this.path;
	};

	MobileEntity.prototype.hasPath = function() {
		return this.hasPath;
	};

	MobileEntity.prototype.setPath = function(path) {
		this.path = path;
		this.activeLength = this.path.getFirstLength();
		this.hasPath = true;
		this.lifetime = this.path.getLastLength().end;
	};

	MobileEntity.prototype.spawn = function() {
		this.addToCanvas(this.canvas);
		this.setPosition(this.getActiveLength().x1, this.getActiveLength().y1)
		this.spawned = true;
	};

	MobileEntity.prototype.getNextLength = function() {
		this.activeLength = this.path.lengthAfter(this.activeLength);
	};

	MobileEntity.prototype.getActiveLength = function() {
		return this.activeLength;
	};

	MobileEntity.prototype.drive = function(time) {

		/*
			This drive functionality has the following cases to cover:
				1) time < the spawn time of this entity (not time to spawn)
				2) time > the spawn time of this entity (time to spawn)
				3) time < the life time of the current length of this entity
				4a) time > the life time of the current length of this entity && time > next length start
				4b) time > the life time of the current length of this entity && time < next length start
				5) time > the life time this entity's last length

		*/

		//Case 1
		if(time < this.path.getFirstLength().start){
			return;
		}  

		//Case 2
		else if(time > this.path.getFirstLength().start && ! this.spawned){
			this.spawn();
			return;
		}  

		//Case 3
		else if(time < this.getActiveLength().end){
			var updatedX = this.getActiveLength().x1 + this.getActiveLength().xStep * (time-this.getActiveLength().start);
			var updatedY = this.getActiveLength().y1 + this.getActiveLength().yStep * (time-this.getActiveLength().start);
			this.setPosition(updatedX, updatedY);
			return;
		}  

		//case 4
		else if((time > this.getActiveLength().end) && (this.getActiveLength() != this.path.getLastLength())){

			nextLength = this.path.lengthAfter(this.activeLength);
			if(time < nextLength.start){
				this.setPosition(this.getActiveLength().x2, this.getActiveLength().y2);
			} else { 
				this.getNextLength();
				this.setPosition(this.getActiveLength().x1, this.getActiveLength().y1);
			}
			return;
		} 


		//case 5
		else if(time > this.path.getLastLength().end){
			this.setPosition(this.path.getLastLength().x2, this.path.getLastLength().y2);
			this.finishedMoving = true;
		}



	};
	
	function Zone(id){
		//General Data
		this.id = id;
		this.externalid= id;
		this.isActive = false;
		this.isInvis = false;
		this.isOn = false;
		this.lift = false;
		this.resize = false;
		this.reset = false;
		this.fillcolor = 0x111111;
		this.linecolor = 0x00FF00;
		this.x = null;
		this.y = null;
		this.r = null;
		this.resizex = null;
		this.resizey = null;
		//anonymity Data
		this.time = null;
		this.tdelta = 3000;//Delta T / Silence Period.
		this.tping = 5000;//How long till cars go silence
		this.lastMix = 0;
		this.kset = [];//for each car currently in the zone +1
		this.colorarray = [0xFF0000,0x00FF00,0x0000FF];
		this.colorcount = -1;
		this.kindex = 0;//Sum of all cars exiting anonymity
		this.k = 0;//Zones average anonymity
		
		//Add to Zone Array
		allZones.push(this);
	}
	//specific kind of zone
	Zone.prototype.mixZoneSetup = function(){
		this.setRadius(100);
		this.setPosition((this.r * this.id)+this.r,(this.r * this.id)+this.r);
		this.setResizePosition((this.x+this.r)-(this.r/3),(this.y+this.r)-(this.r/3));
	}
	//currently one shape :(	
	Zone.prototype.newGraphics = function(){
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(5, this.linecolor);
		this.graphics.beginFill(this.fillcolor,0);
		this.graphics.drawCircle(this.x,this.y,this.r);
		this.graphics.interactive = true;
		this.graphics.hitArea = new PIXI.Circle(this.x,this.y,this.r);
		this.graphicsResize = new PIXI.Graphics();
			this.graphicsResize.beginFill(0x222222);
			this.graphicsResize.lineStyle(5, this.linecolor);
			this.graphicsResize.drawCircle(this.resizex,this.resizey,30);
			this.graphicsResize.interactive = true;
			this.graphicsResize.hitArea = new PIXI.Circle(this.resizex,this.resizey,30);
			this.graphicsResize.buttonMode = true;
		zoneStage.addChild(this.graphics);
		zoneStage.addChild(this.graphicsResize);
		this.graphics.zone = this;
		this.graphicsResize.zone = this;
		this.graphicsResize.mousedown = function(){
			allZones.forEach(function(zone){
				if(zone.isActive){
					zone.isActive = false;
				}
			});
			this.zone.resize = true;
			this.zone.isActive = true;
		}
		
		this.graphicsResize.mouseup = function(){
			this.zone.resize = false;
		}
		this.graphics.mousedown = function(){
			allZones.forEach(function(zone){
				if(zone.isActive){
					zone.isActive = false;
				}
			});
			this.zone.lift = true;
			this.zone.isActive = true;
		}
		
		this.graphics.mouseup = function(){
			this.zone.lift = false;
		}
		
	}
	Zone.prototype.newText = function(txt){
		this.text = new PIXI.Text(txt, {font:"75px Arial", fill:"white"});
		this.text.anchor.x = 0.5; 
		this.text.anchor.y = 0.5; 
		this.text.x = this.x;
		this.text.y = this.y;
		zoneStage.addChild(this.text);
	}
	
	Zone.prototype.setRadius = function(nr){
		if(nr < 100){nr =100;}
		this.r = nr;
		this.setResizePosition((this.x+this.r)-(this.r/3),(this.y+this.r)-(this.r/3));
	}
	
	Zone.prototype.setPosition = function(nx,ny){
		this.x = nx;
		this.y = ny;
		this.setResizePosition((this.x+this.r)-(this.r/3),(this.y+this.r)-(this.r/3));
	}
	
	Zone.prototype.getPosition = function(){
		return [this.x, this.y];
	}
	
	Zone.prototype.setResizePosition = function(nx,ny){
		this.resizex = nx;
		this.resizey = ny;
	}
	
	Zone.prototype.setFillColor = function(fillcolor){
		this.fillcolor = fillcolor;
	}
	
	Zone.prototype.setLineColor = function(linecolor){
		this.linecolor = linecolor;
	}
	
	Zone.prototype.redrawGraphics = function(){
		zoneStage.removeChild(this.graphics);
		zoneStage.removeChild(this.graphicsResize);
		this.graphics.clear();
		this.graphicsResize.clear();
		this.newGraphics();
	}
	
	Zone.prototype.redrawText = function(txt){
		if(this.text){
			zoneStage.removeChild(this.text);
			this.text.destroy();
		}
		this.newText(txt);
	}
	
	Zone.prototype.removeZone = function(zone,fixArray){
		zone.isActive = false;
		zone.isOn = false;
		zoneStage.removeChild(zone.text);
		zoneStage.removeChild(zone.graphicsResize);
		zoneStage.removeChild(zone.graphics);
		if(fixArray){
			allZones.splice(zone.id,1);
			allZones.forEach(function(x,index){
				if(index >= zone.id){
					x.id -= 1;
				}
			});
		}
	}
	
	Zone.prototype.getDistanceFromCar = function(car){
		zonePos = this.getPosition();
		carPos = car.getPosition();
		return Math.sqrt(Math.pow((zonePos[0] - carPos[0]),2) + Math.pow((zonePos[1] - carPos[1]),2));
	}
	
	Zone.prototype.setPingTime = function(newint){
		this.tping = newint;
		console.log(this.tping);
	}
	Zone.prototype.setDeltaTime = function(newint){
		this.tdelta = newint;
	}
	
	Zone.prototype.carEnter = function(car,time){
		car.currentZone = this; 
		car.setExternalID(Math.floor(Math.random() * (1000 - 1)) + 1);
		car.ke = time;
		this.kset.push(car);
		//console.log(car.getInternalID());
		//console.log(car.kset);
		
	}
	
	Zone.prototype.mixCars = function(zone,time){
		zone.colorcount ++;
		zone.lastMix = time;
		if(zone.colorcount > (zone.colorarray.length - 1)){
			zone.colorcount = 0;
		}
		var color = this.colorarray[this.colorcount];		
		zone.kset.forEach(function(c){
			c.currentZone = null;
			c.pastZones.push(zone);
			c.ke = null;
			c.ks = zone.tdelta;
			if(c.kr == null){
				c.kr = time;
			}
			var i = zone.kset.indexOf(c);
			var carset = zone.kset;
			carset.forEach(function(c2){
				if(c != c2){
					c.kset.push(c2);
				}
			});
			c.kcolor = color;
			c.isInvis = true;
			///////////////////////////
			//console.log(c.getInternalID());
			//console.log(c.kset);
			//////////////////////////////
		});
				
		zone.kset = [];
	}
	////////////CARS/////////
		//this.currentZone = null;//current zone the car resides in.
		//this.ke = 0;//time that car entered zone
		//this.kset = [];//all cars this has become mixed with
		//this.k = 0;//number of cars this has mixed with
	////////////ZONES//////////////////
		//this.time = null;
		//this.tdelta = 5000;//Delta T / Silence Period.
		//this.tping = 10000;//How long till cars go silence
		//this.kset = [];//for each car currently in the zone +1
		//this.kindex = 0;//Sum of all cars exiting anonymity
		//this.k = 0;//Zones average anonymity
	
	
	
	
