	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFFFFFF);
	stage.interactive = true;

	var pointStage = new PIXI.DisplayObjectContainer();
	pointStage.visible = true;
	var lineStage = new PIXI.DisplayObjectContainer();
	lineStage.visible = true;
	var bgStage = new PIXI.DisplayObjectContainer();
	bgStage.visible = true;
	var otherStage = new PIXI.DisplayObjectContainer();
	otherStage.visible = true;
	
	
	
	// create a renderer instance.
	var cs;
		while(isNaN(cs)){
			 cs = prompt("How large do you want the grid? (Pixels)", "1000");
		}
	var cs = cs;
	
	var renderer = PIXI.autoDetectRenderer(cs, cs, document.getElementById('display-canvas'));
	document.getElementById('display-canvas').style.height = Math.min(window.innerHeight, window.innerWidth);
	document.getElementById('display-canvas').style.width = Math.min(window.innerHeight, window.innerWidth);
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);
	requestAnimFrame( animate );
	
	
	
	//Display Grid
	var g = (cs * 0.05);
	var i = 0;
	while(i < cs){
		grid = new PIXI.Graphics();
		//X
		grid.lineStyle(cs/500, 0xa7a7a7);
		grid.moveTo(i,0);
		grid.lineTo(i,cs);
		//Y
		grid.lineStyle(cs/500, 0xa7a7a7);
		grid.moveTo(0,i);
		grid.lineTo(cs,i);
		
		bgStage.addChild(grid);
		i += g;
	}
	
	
	
	//make clickable background
	bg = new PIXI.Graphics();
	bg.lineStyle(1,0x000000);
	bg.beginFill(0xa7a7a7,1);
		var cw = document.getElementById('display-canvas').style.width;
		var ch = document.getElementById('display-canvas').style.height;
	bg.drawRect(0,0,cw,ch);
	bg.interactive = true;
	//bg.hitArea = new PIXI.Rectangle(0,0,cw,ch);
	bgStage.addChild(bg);
	
	
	
	//Display mouse position
	var xyText	= new PIXI.Text("", {font:"28px Arial", fill:"black"});
	otherStage.addChild(xyText);
	///////////////////////////Global Variables////////////////////////////////////
	var keyPoints = [];
	var keyLengths = [];
	///////////////////////////////////////////////////////////////////////////////
	
	stage.addChild(otherStage);
	stage.addChild(lineStage);
	stage.addChild(pointStage);
	stage.addChild(bgStage);
	
	function animate() {
	menu.MapSize = cs;
		
	//grab mouse position and display
	var mousePos = stage.getMousePosition();
	var mx = Math.round(mousePos.x);
	var my = Math.round(mousePos.y);
	xyText.setText(mx + " : " + my);
	xyText.x = mx + 20;
	xyText.y = my + 20;
	bg.mousedown = function(){
		var point = new keyPoint(keyPoints.length,x,y);
		point.newGraphics((cs/1000));
	}
		stage.swap
	    renderer.render(stage);
		
	    requestAnimFrame( animate );
	}
