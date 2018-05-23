let power = document.getElementById('power');
let reset = document.getElementById('reset');
let donate = document.getElementById('donate');

power.onclick = function(element) {
	if (sessionStorage.getItem("POWER") === null || sessionStorage.getItem("POWER") === "false") {
		console.log("null, setting to true");
		sessionStorage.setItem("POWER", "true");
	}
	else {
		sessionStorage.setItem("POWER", "false");
	}
	document.getElementById("poweron").className = (sessionStorage.getItem("POWER") === "true" ? "on" : "off");
	document.getElementById("poweroff").className = (sessionStorage.getItem("POWER") === "true" ? "off" : "on");
	chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
		chrome.tabs.executeScript(
			{code: `
			if (streamPopDictionary === undefined) {
				console.log("Undefined streamPopDictionary. Creating new variables");
				var streamPopDictionary = {totalIterations: 0, wordCount: {}};
				var lastTime;
				var idHash = null;
				var poweroff = false;
			}
			idHash = document.body.getElementsByTagName("yt-live-chat-text-message-renderer");
			// This function will execute every second
			updatePopDictionary = function() {
				//console.log((new Date()).toTimeString());
				console.log(streamPopDictionary.totalIterations, idHash.length);				
				//for (var i=0; i< idHash.length; i++ ) {
					//streamPopDictionary.totalIterations = streamPopDictionary.totalIterations + 1;
					//console.log(streamPopDictionary.totalIterations, idHash.length);
					//console.log("0:", idHash[i].children[1].children[0].innerHTML); //Time	
					//console.log("2:", idHash[i].children[1].children[2].innerHTML); //User
					//console.log("3:", idHash[i].children[1].children[3].innerHTML); //Text
				//}
			}
			if (poweroff === false) {
				poweroff = setInterval(() => updatePopDictionary(), 1000);
			} else {
				clearInterval(poweroff);
				poweroff = false;
			}
			`});
	});
};

reset.onclick = function(element) {
	chrome.tabs.executeScript(
		{code: `console.log("RESET")`}
	);
};
donate.onclick = function(element) {
	window.open('https://paypal.me/patrickgesarcarroll/4.20', '_blank');
};

var counter = 0;
document.getElementById("poweron").className = (sessionStorage.getItem("POWER") === "true" ? "on" : "off");
document.getElementById("poweroff").className = (sessionStorage.getItem("POWER") === "true" ? "off" : "on");
alert(sessionStorage.getItem("POWER"));
//console.log(message_parent);

// When a new chat is added
// Console.log that new chat
// Put that new chat into a dictionary of user { time: message }
// Compile a real time dictionary of word: frequency
// Another dictionary of word: frequency per user
// Display that in the popup
// Only display last 30 seconds
//
// DOM Tree
// id = "author-name" Brayden Walton
// id = "message" Text
// Parent id="content"
// yt-live-chat-text-message-renderer id = "SOMEHASH"
// div id="items"
// div id="item-offset"
// div id="item-scroller"
// div id="contents"
// yt-live-chat-item-list-renderer
// div id="item-list
// div id="chat"
// div id="contents"
// div id="chat-messages"
// iron-pages id="content-pages"
// yt-live-chat-renderer
// ytg-compact-watch-page
// ytg-page-manager
// div id="content-layer"
