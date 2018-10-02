'use strict'

class KeyboardController {
	constructor(bindedActions, target){
		
		this.SWIPE_LEFT = "swipe left";
		this.SWIPE_RIGHT = "swipe right";
		this.SWIPE_UP = "swipe up";
		this.SWIPE_DOWN = "swipe down";
		this.MIN_DISTANCE = 10;

		this.target = target;

		this.pressedKeys = {};
		this.complitedTouches = {};
		
		if(!bindedActions){
			this.bindedActions = {};
		}else{
			this.initialize = function(actions){
				for (var actionName in actions) {
					actions[actionName].enabled = true;
					actions[actionName].active = false;
				};
				return actions;
			};		
			this.bindedActions = this.initialize(bindedActions);
		}

		



		this.attach = function(target) {
			var scope = this;
			var coords = {
				x: 0,
				y: 0
			};

			target.onkeydown = function(e){

				var key_object = scope.pressedKeys[e.keyCode];
				var _actions = scope.bindedActions;


				function setAction() {
					for (var _actionName in _actions){
						if (_actions[_actionName].keys.indexOf(e.keyCode) != -1){
							return _actionName;
						}
					}
				};


				if (!key_object){
					key_object = scope.pressedKeys[e.keyCode] = {
						pressed: true,
						action: ""
					};
					key_object.action = setAction();
				}


				if (!key_object.action){
					key_object.action = setAction();
				}

				key_object.pressed = true;
				var actionName = key_object.action;
				if (actionName){	
					if (!_actions[actionName].active){
						_actions[actionName].active = true;

						var event = new CustomEvent("controls:activate", {detail: {
							actionName: actionName
						}});

						scope.target.dispatchEvent(event);
					}
				}	
			};
			
			target.onkeyup = function(e){
				var key_object = scope.pressedKeys[e.keyCode];
				if (key_object){
					var actionName = key_object.action;
					key_object.pressed = false;	
				}
				
				var _actions = scope.bindedActions;

				if (_actions[actionName]){
					_actions[actionName].active = false
				}

				var event = new CustomEvent("controls:deactivate", {detail: {
					actionName: actionName
				}});

				scope.target.dispatchEvent(event);
			};


			target.ontouchstart = function(e) {
				var _touch = e.changedTouches[0];
				coords.x = parseInt(_touch.clientX);
				coords.y = parseInt(_touch.clientY);
			};

			target.ontouchend = function(e) {
				var _touch = e.changedTouches[0];
				var endX = parseInt(_touch.clientX);
				var endY = parseInt(_touch.clientY);
				var startX = coords.x;
				var startY = coords.y;
				var distanceX = Math.abs(startX - endX);
				var distanceY = Math.abs(startY - endY);
				var command;
				var _actions = scope.bindedActions;

				if (!(distanceY < scope.MIN_DISTANCE && distanceX < scope.MIN_DISTANCE)){
					if (distanceY >= distanceX) {
						if (startY - endY >= 0){
							command = scope.SWIPE_UP;
						}else {
							command = scope.SWIPE_DOWN;
						}
					}else{
						if (startX - endX >= 0){
							command = scope.SWIPE_LEFT;
						}else {
							command = scope.SWIPE_RIGHT;
						}
					}
				}



				function setAction(){
					for (var actionName in _actions){
						if (_actions[actionName].touch.localeCompare(command) === 0){
							return actionName;
						}
					}
				};

				var touch_object = scope.complitedTouches[command];

				if (!touch_object){
					touch_object = scope.complitedTouches[command] = {
						action: ""
					};
					touch_object.action = setAction();
				}

				if (!touch_object.action){
					touch_object.action = setAction();
				}

				var actionName = touch_object.action;


				if (actionName){

					var event = new CustomEvent("controls:activate", {detail: {
						actionName: actionName
					}});


					scope.target.dispatchEvent(event);
				}

			};
		};

		this.detach = function(){
			this.target.onkeydown = null;
			this.target.onkeyup = null;
			this.target.ontouchend = null;
			this.target.ontouchstart = null;
		};

		this.enableAction = function(actionName){
			var _action = this.bindedActions[actionName];
			if (_action){
				_action.enabled = true;
			}
		};

		this.disableAction = function(actionName){
			var _action = this.bindedActions[actionName];
			if (_action){
				_action.enabled = false;
			}
		};

		this.isActionActive = function(actionName){
			return this.bindedActions[actionName].active;
		};

		this.isActionEnabled = function(actionName){
			return this.bindedActions[actionName].enabled;
		};

		this.isKeyPressed = function(key){
			return this.pressedKeys[key].pressed;
		};

		this.bindActions = function(extraActions){
			var _actions = this.bindedActions;

			function concatArrs(arr1, arr2) {

				for (var i = 0; i < arr2.length; i++){
					var matched = false;

					for (var j = 0; j < arr1.length; j++){
						if (arr1[i] === arr2[j])
							matched = true;
					};

					if (!matched){
						arr1.push(arr2[i]);
					}
				};
				return arr1;
			};

			for (var actionName in extraActions) {
				if (_actions[actionName]){
					_actions[actionName].keys = concatArrs(_actions[actionName].keys, 
						extraActions[actionName].keys);
				}else{
					_actions[actionName] = {};
					_actions[actionName].keys = extraActions[actionName].keys;
					_actions[actionName].touch = extraActions[actionName].touch;
					_actions[actionName].enabled = true;
					_actions[actionName].active = false;
				}
			};
		};

	}

};
