//This code loads the IFrame Player API code asynchronously.

var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//			

var PLAYLIST_ID = "6F45472485FBD025";
		
var player;
var playlistIDs = [];
var titles = [];

function onYouTubeIframeAPIReady() {

  //create youtube player
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'null',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

}

//cue playlist when player is ready
function onPlayerReady(event){

  player.cuePlaylist(PLAYLIST_ID);

}

      		//once playlist is cued, call to grab the titles of the videos
function onPlayerStateChange(event){

  if (player.getPlayerState() == 5){
    loadTitles();
	}

}

//ajax calls to grab the title of each video in the playlist
function loadTitles(){
				
	var YTUrl = "https://gdata.youtube.com/feeds/api/videos/"
	playlistIDs = player.getPlaylist();

	for(var i = 0; i < playlistIDs.length; i++){   

		$.ajax({
			async: false,
      url: YTUrl + playlistIDs[i] + "?v=2&alt=jsonc",
      dataType: 'jsonp',
       	success: function(results){
       	  titles.push(results.data.title);

       		if(i === playlistIDs.length){
       			loadThumbs();
       		}
       	}
    });

  }
}

//load images and construct thumbnail grid below player
function loadThumbs(){

	var listItems = "";
	var YTUrl = "https://gdata.youtube.com/feeds/api/videos/"
	playlistIDs = player.getPlaylist();


	for(var i = 0; i < playlistIDs.length; i++){

    var img = "http://img.youtube.com/vi/" + playlistIDs[i] + "/default.jpg";

		listItems += "<li id = 'thumb' onclick = 'selectVid(" + i + ")'><img src = '" + img + "'>" + titles[i] + "</li>";	

  }

	$("#thumbGrid").html(listItems);
}

//load video when thumbnail is clicked
function selectVid(index){
	player.playVideoAt(index);
}
