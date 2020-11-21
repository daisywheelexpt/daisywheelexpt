/*
* Based on the Gamepad API Test
* Originally written in 2013 by Ted Mielczarek <ted@mielczarek.org>
*
* To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
*
* You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};

var BUTTON = {
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	LB: 4,
	RB: 5,
	LT: 6,
	RT: 7,
	SELECT: 8,
	START: 9,
	L_STICK: 10,
	R_STICK: 11,
	D_UP: 12,
	D_DOWN: 13,
	D_LEFT: 14,
	D_RIGHT: 15,
	POWER: 16

}

function connecthandler(e) {
 	addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
	controllers[gamepad.index] = gamepad;
	window.requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
	removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
	delete controllers[gamepad.index];
}

var canPress = true;
var pressLimit = 140;

function buttonPressed(c, b) {
	if (!canPress) return false;
	button = c.buttons[b];
	if (typeof(button) == "object") {
		if (button.pressed == 1.0) {
			canPress = false;
			setTimeout(function(){ canPress = true; }, pressLimit);
			return true;
		}
	}
}

var canMove = true;
var moveLimit = 150;

function lockMove() {
	canMove = false;
	setTimeout(function(){ canMove = true; }, moveLimit);
}

var threshold = 0.9;

function navigateText(button) {
	$('textarea').trigger('navigate', button);
}

function updateStatus() {
	scangamepads();
	for (j in controllers) {
		var c = controllers[j];

		if (buttonPressed(c, BUTTON.A)) { navigateText("enter"); }

		if (buttonPressed(c, BUTTON.LB)) { navigateText("bksp");  }
		if (buttonPressed(c, BUTTON.RB)) { navigateText("space"); }

		if (buttonPressed(c, BUTTON.D_LEFT))  { navigateText("left");	}
		if (buttonPressed(c, BUTTON.D_RIGHT)) { navigateText("right");	}
		if (buttonPressed(c, BUTTON.D_UP))	  { navigateText("up");		}
		if (buttonPressed(c, BUTTON.D_DOWN))  { navigateText("down");	}

		if (canMove) {
			var x_axis = c.axes[0]
			var y_axis = c.axes[1]

			if 		(x_axis < -0.5) { navigateText("left");	 lockMove(); }
			else if (x_axis > 0.5)  { navigateText("right"); lockMove(); }

			if 		(y_axis < -0.5) { navigateText("up");   lockMove(); }
			else if (y_axis > 0.5)  { navigateText("down"); lockMove(); }
		}
	}
	window.requestAnimationFrame(updateStatus);
}

function scangamepads() {
	var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i] && (gamepads[i].index in controllers)) {
			controllers[gamepads[i].index] = gamepads[i];
		}
	}
}

if (haveEvents) {
	window.addEventListener("gamepadconnected", connecthandler);
	window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
	window.addEventListener("webkitgamepadconnected", connecthandler);
	window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
	setInterval(scangamepads, 500);
}
