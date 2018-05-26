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
			var subdomain = window.location.host.split('.')[0];
			var gaming = subdomain === "gaming";
			if (streamPopDictionary === undefined) {
				console.log("Undefined streamPopDictionary. Creating new variables");
				var streamPopDictionary = {};
				var lastTime;
				var idHash = null;
				var poweroff = false;
			}
			if (gaming) {
				idHash = document.body.getElementsByTagName("yt-live-chat-text-message-renderer");
			} else {
				idHash = document.getElementById("chatframe");
				idHash = idHash.contentWindow.document.body;
				idHash = idHash.getElementsByTagName("yt-live-chat-text-message-renderer");
			}
			console.log(idHash);
			// EVENTUALLY I WANT to MOVE THIS INTO POP
			PopContainer = document.createElement("span");
			$(PopContainer).addClass("streampop-class");
			$(document.body).append(PopContainer);
			$(PopContainer).css("position", "absolute");
			$(PopContainer).css("top", "100px");
			$(PopContainer).css("left", "100px");
			$(PopContainer).css("z-index", "9000");
			streamPopFirst = document.createElement("H1");
			streamPopSecond = document.createElement("H1");
			streamPopThird = document.createElement("H1");
			[streamPopFirst, streamPopSecond, streamPopThird].forEach(item => {
				$(item).css("color", "white");
				$(item).css("text-shadow", "2px 2px 4px #000000");
				PopContainer.append(item);
			})
			// This function will execute every second
			updatePopDictionary = function() {
				//console.log((new Date()).toTimeString());
				// streamPopDictionary.totalIterations = streamPopDictionary.totalIterations + 1;
				//console.log(streamPopDictionary.totalIterations, idHash.length);
				var cleanEmojis = (words) => {
					if (words.indexOf("<img class") === -1)
						return words; 
					let start = words.indexOf("<img class");
					let newwords = words.substring(start, words.substring(start, words.length).indexOf(">"));
					return cleanEmojis(newwords);
				}				
				/// BUILDING THE DICTIONARY
				for (var i=0; i< idHash.length; i++ ) {
					//console.log(streamPopDictionary.totalIterations, idHash.length);
					//console.log("0:", idHash[i].children[1].children[0].innerHTML); //Time	
					let user = idHash[i].children[1].children[2].innerHTML; //User
					//console.log("3:", idHash[i].children[1].children[3].innerHTML); //Text
					// GOING TO CLEAR THE EMOJIS FROM THE TEXT
					let words = idHash[i].children[1].children[3].innerHTML;
					cleanedWords = cleanEmojis(words);
					// I CAN HAVE A HASH OF SOME UNIQUE ID USED SO I DONT DOUBLE CHECK
					(cleanedWords.split(" ")).forEach(word => {
						if (word === "" || word === "you" || word === "the" || word === "a" || word === "to" || word === "I" || word === "and" || word === "are" || word === "is") {
							return;
						}
						if ((word in streamPopDictionary) == false) {
							streamPopDictionary[word] = [user];
						}
						else if (streamPopDictionary[word].indexOf(user) === -1) {
							streamPopDictionary[word].push(user);
						}
					});
				}
				var sortedItems = Object.keys(streamPopDictionary).map(key => [key, streamPopDictionary[key].length]);
				sortedItems.sort(function(first, second) {
					return second[1] - first[1];
				})
				var topThree = sortedItems.slice(0, 3);
				console.log(topThree);
				streamPopFirst.innerHTML = topThree[0][0] + " : " + topThree[0][1] ;
				streamPopSecond.innerHTML = topThree[1][0] + " : " + topThree[1][1] ;
				streamPopThird.innerHTML = topThree[2][0] + " : " + topThree[2][1] ;
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
// alert(sessionStorage.getItem("POWER"));
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
