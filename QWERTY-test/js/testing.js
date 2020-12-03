/* https://github.com/Mottie/Keyboard
 * Navigate extension demo
	 Documentation for this extension can be found at
	 https://github.com/Mottie/Keyboard/wiki/Setup#navigation
 
 * Click the [toggle] button to use the navigation controls
*/

t = 0;
total = 0;
errors = 0;

function _id(id) { return document.getElementById(id); };

function input_reset() {
	$('#keyboard')[0].value = "";
	$('.ui-keyboard-preview')[0].value = "";
	$('#keyboard').getkeyboard().reveal();
}

lines = [];

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
				total = Date.now() - t.getTime();
				updateOutput();
			}
		})
		.addNavigation({
			position: [0, 0], // set start position [row-number, key-index]
			toggleMode: false, // true = navigate the virtual keyboard, false = navigate in input/textarea
			focusClass: 'hasFocus' // css class added when toggle mode is on
		});

	$('button#start').click(function() {
		t = new Date();
	});

	$('button#reset').click(function() {
		var blob = new Blob([lines.join('\n')], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "daisy-test.csv");
	});
});

function addRowData(row, text) {
	let data = document.createElement("td");
	data.innerText = text;
	row.appendChild(data);
}

function updateOutput() {
	var table = _id("results");

	// Create the new row
	let row = document.createElement("tr");
	table.appendChild(row);

	// Log the time taken
	time = (total/1000).toFixed(2);
	addRowData(row, time);

	// Log the wpm
	wpm = (9 / (total/1000/60)).toFixed(1);
	addRowData(row, wpm);

	// Determine the number of errors
	sentence = $("#sentence").text();
	console.log(sentence);
	input_test = _id("keyboard");
	input_str = input_test.value;

	errors = 0;
	for (var i = input_str.length - 1; i >= 0; i--) {
		if (input_str[i] != sentence[i]) errors++;
	}
	errors += Math.max(input_str.length, sentence.length) - Math.min(input_str.length, sentence.length);

	// Log the number of errors
	addRowData(row, errors);

	// Add the data line for later export
	lines.push([time, wpm, errors].join(','));

	input_reset();
	t = new Date();
}