//Keypoints
	function keyPoint(id,x,y){
		this.id = id;
		this.x = x;
		this.y = y;
		this.r = 10;
		this.isActive = false;
		
		//add to point array
		keyPoints.push(this);
	}

	keyPoint.prototype.newGraphics = function(){
		this.graphics = new PIXI.Graphics();
		this.graphics.lineStyle(3,0x0066CC);
		this.graphics.beginFill(0x85E6FF);
		this.graphics.drawCircle(this.x,this.y,this.r);
		this.graphics.interactive = true;
		this.graphics.hitArea = new PIXI.Circle(this.x,this.y,this.r);
		pointStage.addChild(this.graphics);
		
		//MouseDown
		this.graphics.keyPoint = this;
		this.graphics.mousedown = function(){
			keyPoints.forEach(function(point){
				if(point.isActive){
						point.isActive = false;
				}
			});
			this.keyPoint.lift = true;
			this.keyPoint.isActive = true;
		}
		//MouseUp
		this.graphics.mouseup = function(){
			this.keyPoint.lift = false;
		}
		
	}
