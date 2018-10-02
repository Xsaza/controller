'use strict';

(function(){

	var coords = {
		x: 63,
		y: 59
	};

	var field = document.getElementById("field");

	var controller = new KeyboardController(undefined, window);

	var actions = {
		"move left": {
			keys:[37, 65],
			touch: controller.SWIPE_LEFT
		},
		"move right": {
			keys:[39, 68],
			touch: controller.SWIPE_RIGHT
		},
		"move down":{
			keys:[40, 83],
			touch: controller.SWIPE_DOWN
		}
	};

	var extraActions = {
		"move up":{
			keys:[38, 87],
			touch: controller.SWIPE_UP
		}
	};

	controller.bindActions( actions );
	


	// field.onmouseout = function(){
	// 	var _action = controller.bindedActions;
	// 	for (var actionName in _action){
	// 		_action[actionName].active = false;
	// 	}

	// 	controller.detach();
	// };

	// field.onmouseover = function(){
	// 	controller.attach(controller.target);
	// };

	controller.attach(controller.target);

	window.controller = controller;
	window.extraActions = extraActions;


	controller.target.addEventListener("controls:activate", function(customEvent){
		var actionName = customEvent.detail.actionName;
		var _action = controller.bindedActions[actionName];
		console.log(actionName);
		// if (_action){
		// 	_action.active = true;
		// }

		switch (actionName){
			case "move left":
			if (controller.isActionEnabled("move left")){
				heroStyle.marginLeft = `${coords.x - 10}px`;
				coords.x -= 10;
			}
			break;

			case "move right":
			if (controller.isActionEnabled("move right")){
				heroStyle.marginLeft = `${coords.x + 10}px`;
				coords.x += 10;
			}
			break;

			case "move up":
			if (controller.isActionEnabled("move up")){
				heroStyle.marginTop = `${coords.y - 10}px`;
				coords.y -= 10;
			}
			break;

			case "move down": 
			if (controller.isActionEnabled("move down")){
				heroStyle.marginTop = `${coords.y + 10}px`;
				coords.y += 10;
			}
			break;
		};

	});

	controller.target.addEventListener("controls:deactivate", function(customEvent){
		var actionName = customEvent.detail.actionName;
		var _action = controller.bindedActions[actionName];

		if (_action){
			_action.active = false;
		}

	});

	var _actions = controller.bindedActions;
	var heroStyle = document.getElementById("hero").style;

	// setInterval(()=>{

	// 	if (_actions["move left"]){
	// 		if (controller.isActionEnabled("move left")){
	// 			if(controller.isActionActive("move left")){
			// 		heroStyle.marginLeft = `${coords.x - 10}px`;
			// 		coords.x -= 10;
			// 	}
			// }
	// 	}

	// 	if (_actions["move right"]){
	// 		if (controller.isActionEnabled("move right")){
	// 			if(controller.isActionActive("move right")){
	// 				heroStyle.marginLeft = `${coords.x + 10}px`;
	// 				coords.x += 10;
	// 			}
	// 		}
	// 	}

	// 	if (_actions["move up"]){
	// 		if (controller.isActionEnabled("move up")){
	// 			if(controller.isActionActive("move up")){
	// 				heroStyle.marginTop = `${coords.y - 10}px`;
	// 				coords.y -= 10;
	// 			}
	// 		}
	// 	}
	

	// 	if (_actions["move down"]){
	// 		if (controller.isActionEnabled("move down")){
	// 			if(controller.isActionActive("move down")){
	// 				heroStyle.marginTop = `${coords.y + 10}px`;
	// 				coords.y += 10;
	// 			}
	// 		}
	// 	}

	// }, 40)

})();