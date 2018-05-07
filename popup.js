let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
	changeColor.style.backgroundColor = data.color;
	changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
	let color = element.target.value;
	chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
		chrome.tabs.executeScript(
			{code: `
			var idHash = document.body.getElementsByTagName("yt-live-chat-text-message-renderer");
			console.log(idHash.length);
			for (var i=0; i< idHash.length; i++ ) {
				console.log(idHash[i].children[1].children[0].innerHTML);	
				console.log(idHash[i].children[1].children[2].innerHTML);	
				console.log(idHash[i].children[1].children[3].innerHTML);	
			}
			// (node => {
			// 	console.log(node.namedItem("content").namedItem("message"));
			// 	console.log(node.namedItem("content").namedItem("author-name"));
			// }
			// );
			`});
	});
};

var counter = 0;
console.log(message_parent);

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
