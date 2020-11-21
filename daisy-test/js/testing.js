function $id(id) { return document.getElementById(id); };

input_test = $id("test");
init_input_text = input_test.value;

t = 0;

input_test.onfocus = function() {
	t = new Date();
};

document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 27) { //Escape
  	total = Date.now() - t.getTime();
  	setTimeout(function(){
  		updateOutput();
  	}, 1000);
  }
});

total = 0;
errors = 0;

function addRowData(row, text) {
	let data = document.createElement("td");
	data.innerText = text;
	row.appendChild(data);
}

lines = [];

function updateOutput() {
	var table = $id("results");

	// Create the new row
	let row = document.createElement("tr");
	table.appendChild(row);

	// Log the time taken
	time = (total/1000).toFixed(2) + " seconds";
	addRowData(row, time);

	// Log the wpm
	wpm = (9 / (total/1000/60)).toFixed(1);
	addRowData(row, wpm);

	// Determine the number of errors
	sentence = $id("sentence").innerText
	console.log(sentence)
	input_str = input_test.value

	errors = 0;
	for (var i = input_str.length - 1; i >= 0; i--) {
		if (input_str[i] != sentence[i]) errors++;
	}
	errors += Math.max(input_str.length, sentence.length) - Math.min(input_str.length, sentence.length);

	// Log the number of errors
	addRowData(row, errors)

	// Add the data line for later export
	lines.push([time, wpm, errors].join(','))

	// Reset the input box
	input_test.value = "";
	init_input_text = input_test.value;
}

$id("reset").onclick = function(e) {
	var blob = new Blob([lines.join('\n')], {type: "text/plain;charset=utf-8"});
	saveAs(blob, `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}-Daisywheel.txt`);
}