/* https://github.com/Mottie/Keyboard
 * Navigate extension demo
	 Documentation for this extension can be found at
	 https://github.com/Mottie/Keyboard/wiki/Setup#navigation
 
 * Click the [toggle] button to use the navigation controls
*/

t = 0;
total = 0;
errors = 0;

$(function() {
	// mini navigation block
	$('#info button').click(function() {
		var $button = $(this),
		action = $button.attr('data-action');
		if (action === 'toggle') {
			// cruddy code to highlight the toggle button while active
			var toggleMode = $('textarea').data('keyboard').navigation_options.toggleMode;
			$button.toggleClass('active', !toggleMode);
		}
		$('textarea').trigger('navigate', action);
	});

	$('#keyboard')
		.keyboard({
			alwaysOpen: true,
			accepted: function() {
				total = Date.now() - t;
				updateOutput();
			}
		})
		.addNavigation({
			position: [0, 0], // set start position [row-number, key-index]
			toggleMode: false, // true = navigate the virtual keyboard, false = navigate in input/textarea
			focusClass: 'hasFocus' // css class added when toggle mode is on
		});

	$('button#start').click(function() {
		t = Date.now();
		console.log("Started!");
	});

	$('button#reset').click(function() {
		location.reload(); 
	});
});

function updateOutput() {
	$('#timer').text((total/1000).toFixed(2));
	$('#wpm').text((9 / (total/1000/60)).toFixed(1));
	input_test = document.getElementById("keyboard")
	for (var i = input_test.value.length - 1; i >= 0; i--) {
		if (input_test.value[i] != $("#sentence").text()[i]) errors++;
		else console.log("input_test.value[i] == sentence[i]")
	}
	$("#err").text(errors);
}