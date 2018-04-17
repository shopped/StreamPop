let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
	let color = element.target.value;
		chrome.tabs.executeScript(
			{code: 'document.body.style.backgroundColor = "' + color + '";'});
};
