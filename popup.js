let power = document.getElementById('power');
let reset = document.getElementById('reset');
let mood = document.getElementById('mood');
let filter = document.getElementById('filter');

/**
 * JS aggregation logic
 */
power.onclick = function(element) {
	chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
		chrome.tabs.executeScript(null, { file: "sentimood.js" }, function() {
		chrome.tabs.executeScript(
			{code: `
			var COMMONWORDS = ["BE","THIS","HAVE","DO","TO","OF","AT","BY","THE","AND","A","I","IT","HE","SHE","BUT","OR","AN","ARE","IS","AM",""];
			var subdomain = window.location.host.split('.')[0];
			var gaming = subdomain === "gaming";

			if (streamPopDictionary === undefined) {
				console.log("Undefined streamPopDictionary. Creating new variables");
				var streamPopDictionary = {};
				var idHash = null;
				var poweroff = false;
				PopContainer = document.createElement("span");
				$(PopContainer).addClass("streampop-class");
				$(document.body).append(PopContainer);
				$(PopContainer).css("position", "absolute");
				$(PopContainer).css("top", "100px");
				$(PopContainer).css("left", "100px");
				$(PopContainer).css("z-index", "9000");
				var streamPopFirst = document.createElement("H1"), streamPopSecond = document.createElement("H1"), streamPopThird = document.createElement("H1"), streamPopFourth = document.createElement("H1"), streamPopFifth = document.createElement("H1"), streamPopSixth = document.createElement("H1"), streamPopSeventh = document.createElement("H1"), streamPopEighth = document.createElement("H1"), streamPopNinth = document.createElement("H1");
				var streamPopArray = [streamPopFirst, streamPopSecond, streamPopThird, streamPopFourth, streamPopFifth, streamPopSixth, streamPopSeventh, streamPopEighth, streamPopNinth];
				streamPopArray.forEach(item => {
					$(item).css("color", "white");
					$(item).css("text-shadow", "2px 2px 4px #000000");
					PopContainer.append(item);
				})
			}
			if (gaming) {
				idHash = document.body.getElementsByTagName("yt-live-chat-text-message-renderer");
			} else {
				idHash = document.getElementById("chatframe");
				idHash = idHash.contentWindow.document.body;
				idHash = idHash.getElementsByTagName("yt-live-chat-text-message-renderer");
			}
			// console.log(idHash);
			var FILTER = "ON";
			var MOOD = "ON";
			updatePopDictionary = function() {
				streamPopDictionary = {};
				chrome.storage.local.get(["FILTER"], (response) => {
					if (response === {} || response["FILTER"] === "OFF") {
						FILTER = "ON";
					} else {
						FILTER = "OFF";
					}
				});
				chrome.storage.local.get(["MOOD"], (response) => {
					if (response === {} || response["MOOD"] === "OFF") {
						MOOD = "ON";
					} else {
						MOOD = "OFF";
					}
				});
				var cleanEmojis = (words) => {
					if (words.indexOf("<img class") === -1)
						return words; 
					let start = words.indexOf("<img class");
					let newwords = words.substring(start, words.substring(start, words.length).indexOf(">"));
					return cleanEmojis(newwords);
				}				
				/// BUILDING THE DICTIONARY AND MOOD
				var moodString = "";
				for (var i=0; i< idHash.length; i++ ) {
					//console.log("0:", idHash[i].children[1].children[0].innerHTML); //Time	
					let user = idHash[i].children[1].children[1].children[1].innerText; //User
					//console.log("User:", idHash[i].children[1].children[1].children[1].innerText);//.children());//("#author-name").innerHTML);
					//console.log("Message:", idHash[i].children[1].children[2].innerText);//("#message").innerHTML); //Text
					let words = idHash[i].children[1].children[2].innerText;
					cleanedWords = cleanEmojis(words);
					if (MOOD === "ON") { moodString = moodString + cleanedWords; }
					(cleanedWords.split(" ")).map(word => word.toUpperCase()).forEach(word => {
						if (word === "")
							return;
						if ((FILTER === "ON") && (COMMONWORDS.indexOf(word) !== -1)) {
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
				if (MOOD === "ON") {
					let sent = new Sentimood();
					let analyze =  sent.analyze(moodString);
					//console.log("SUP");
					//console.log(moodString);
					//console.log(analyze);
					if (analyze.comparative < 0) {
						streamPopArray.forEach(item => {
							$(item).css("color", "red");
						})
					} else {
						streamPopArray.forEach(item => {
							$(item).css("color", "green");
						})
					}
				} else {
					streamPopArray.forEach(item => {
						$(item).css("color", "white");
					})
				}
				var topNine = sortedItems.slice(0, 9);
				streamPopFirst.innerHTML = topNine[0][0] + " : " + topNine[0][1] ;
				streamPopSecond.innerHTML = topNine[1][0] + " : " + topNine[1][1] ;
				streamPopThird.innerHTML = topNine[2][0] + " : " + topNine[2][1] ;
				streamPopFourth.innerHTML = topNine[3][0] + " : " + topNine[3][1] ;
				streamPopFifth.innerHTML = topNine[4][0] + " : " + topNine[4][1] ;
				streamPopSixth.innerHTML = topNine[5][0] + " : " + topNine[5][1] ;
				streamPopSeventh.innerHTML = topNine[6][0] + " : " + topNine[6][1] ;
				streamPopEighth.innerHTML = topNine[7][0] + " : " + topNine[7][1] ;
				streamPopNinth.innerHTML = topNine[8][0] + " : " + topNine[8][1] ;
			}
			if (poweroff === false) {
				console.log("POWER ON");
				$(PopContainer).css("opacity", 1);
				poweroff = setInterval(() => updatePopDictionary(), 1000);
			} else {
				console.log("POWER OFF");
				clearInterval(poweroff);
				$(PopContainer).css("opacity", 0);				
				poweroff = false;
			}
			`});
		});
	});
};

/**
 * Setting opacity of popup buttons
 */
chrome.storage.local.get(["FILTER"], (response) => {
	console.log(response);
	console.log("FILTER" in response);
	console.log(response.FILTER === "OFF");
	if (("FILTER" in response) && (response.FILTER === "OFF"))
	document.getElementById("filteron").className = "fullOpacity";
	else
	document.getElementById("filteron").className = "halfOpacity";
});

/**
 * Set amount of Popular Words from Radio Buttons
 */
$(document).ready(function() {
	$('input[name=num]').click(function(v) {
		chrome.storage.local.set({"POP":v.target.value});
		chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
			chrome.tabs.executeScript(
				{code: `
					if (streamPopArray) {
						for (let i=0; i < 9; i++) {
							if (i < ${v.target.value})
								$(streamPopArray[i]).css("opacity", 1);
							else
								$(streamPopArray[i]).css("opacity", 0)
						}
					}
				`}
			)
		});
	})
})
/**
 * Settings to toggle the filter of the most common words
 */
filter.onclick = function(element) {
	chrome.storage.local.get(["FILTER"], (response) => {
		document.getElementById("filteron").className = "fullOpacity";
		if (response === {}) {
			chrome.storage.localset({"FILTER":"OFF"});
		} else {
			if (response["FILTER"] === "ON") {
				chrome.storage.local.set({"FILTER":"OFF"});
			} else {
				chrome.storage.local.set({"FILTER":"ON"});
				document.getElementById("filteron").className = "halfOpacity";
			}
		}
	});
}

/**
 * Gimme gimme
 */
mood.onclick = function(element) {
	chrome.storage.local.get(["MOOD"], (response) => {
		if (response === {}) {
			chrome.storage.localset({"MOOD":"OFF"});
		} else {
			if (response["MOOD"] === "ON") {
				chrome.storage.local.set({"MOOD":"OFF"});
			} else {
				chrome.storage.local.set({"MOOD":"ON"});
			}
		}
	});
};